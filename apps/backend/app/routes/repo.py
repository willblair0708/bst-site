import os
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Literal, Optional
import subprocess
import shlex

router = APIRouter()

# Resolve monorepo root: apps/backend/app/routes -> ../../../../ (repo root)
BST_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
REPOS = {
    "demo": os.path.join(BST_ROOT, 'examples', 'hello-world-trial')
}


class TreeNode(BaseModel):
    name: str
    path: str
    type: Literal['file', 'dir']
    children: Optional[List['TreeNode']] = None


def _is_allowed(base: str, target: str) -> bool:
    rel = os.path.relpath(target, base)
    return rel and not rel.startswith('..') and not os.path.isabs(rel)


def _build_tree(dir_path: str, base: str, depth: int = 0, max_depth: int = 4) -> List[TreeNode]:
    if depth > max_depth:
        return []
    nodes: List[TreeNode] = []
    try:
        for name in sorted(os.listdir(dir_path)):
            if name.startswith('.') or name in ('node_modules', 'dist', 'build'):
                continue
            full = os.path.join(dir_path, name)
            if not _is_allowed(base, full):
                continue
            if os.path.isdir(full):
                nodes.append(TreeNode(name=name, path=os.path.relpath(full, base), type='dir', children=_build_tree(full, base, depth+1, max_depth)))
            else:
                nodes.append(TreeNode(name=name, path=os.path.relpath(full, base), type='file'))
    except Exception:
        pass
    # sort with dirs first
    nodes.sort(key=lambda n: (0 if n.type == 'dir' else 1, n.name))
    return nodes


@router.get('/repo/tree')
def get_repo_tree(repo: str = Query('demo')):
    base = REPOS.get(repo)
    if not base:
        raise HTTPException(404, 'Unknown repo')
    if not os.path.exists(base):
        raise HTTPException(404, 'Repo path missing')
    return {"repo": repo, "root": os.path.basename(base), "tree": [t.model_dump() for t in _build_tree(base, base)]}


class FileWrite(BaseModel):
    repo: str
    path: str
    content: str


@router.get('/repo/file')
def read_file(repo: str = Query('demo'), path_q: str = Query('')):
    base = REPOS.get(repo)
    if not base or not path_q:
        raise HTTPException(400, 'Missing')
    target = os.path.join(base, path_q)
    rel = os.path.relpath(target, base)
    if rel.startswith('..'):
        raise HTTPException(400, 'Invalid path')
    try:
        with open(target, 'r', encoding='utf-8') as f:
            return {"repo": repo, "path": path_q, "content": f.read()}
    except Exception as e:
        raise HTTPException(500, 'Failed to read file')


@router.post('/repo/file')
def write_file(body: FileWrite):
    base = REPOS.get(body.repo)
    if not base or not body.path:
        raise HTTPException(400, 'Missing')
    target = os.path.join(base, body.path)
    rel = os.path.relpath(target, base)
    if rel.startswith('..'):
        raise HTTPException(400, 'Invalid path')
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, 'w', encoding='utf-8') as f:
        f.write(body.content)
    return {"ok": True}


@router.get('/repo/branches')
def get_branches(repo: str = Query('demo')):
    # Demo: return a static set
    return {"repo": repo, "branches": ["main", "dev", "experiment/analysis"]}


@router.get('/repo/search')
def search_repo(repo: str = Query('demo'), q: str = Query('')):
    base = REPOS.get(repo)
    if not base:
        raise HTTPException(404, 'Unknown repo')
    if not q:
        return {"results": []}
    results = []
    ql = q.lower()
    for root, dirs, files in os.walk(base):
        # skip hidden / heavy dirs
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('node_modules', 'dist', 'build')]
        for f in files:
            if f.startswith('.'):
                continue
            p = os.path.join(root, f)
            rel = os.path.relpath(p, base)
            # filename match
            if ql in f.lower():
                results.append({"path": rel, "preview": f"{f}"})
                continue
            try:
                # small text files only
                if os.path.getsize(p) <= 200_000:
                    with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
                        for i, line in enumerate(fh.readlines()[:500]):
                            if ql in line.lower():
                                results.append({"path": rel, "line": i+1, "preview": line.strip()[:200]})
                                break
            except Exception:
                pass
            if len(results) >= 50:
                break
        if len(results) >= 50:
            break
    return {"results": results}


class ExecRequest(BaseModel):
    repo: str
    cmd: str
    cwd: Optional[str] = None  # relative to repo root


ALLOW_CMDS = {"ls", "cat", "head", "tail", "wc", "pwd", "echo", "python", "python3"}


@router.post('/repo/exec')
def exec_repo(body: ExecRequest):
    base = REPOS.get(body.repo)
    if not base:
        raise HTTPException(404, 'Unknown repo')
    cmd = body.cmd.strip()
    if not cmd:
        return {"ok": True, "code": 0, "stdout": "", "stderr": ""}
    try:
        parts = shlex.split(cmd)
        if parts[0] not in ALLOW_CMDS:
            raise HTTPException(400, f"Command not allowed: {parts[0]}")
        # Working directory under repo root
        cwd = base
        if body.cwd:
            rel = os.path.normpath(body.cwd).replace('\\', '/')
            if rel.startswith('..') or rel.startswith('/'):
                raise HTTPException(400, 'Invalid cwd')
            cwd = os.path.join(base, rel)
        # Validate args: reject absolute/parent paths
        for p in parts[1:]:
            if p.startswith('/') or '..' in p:
                raise HTTPException(400, 'Invalid path argument')
        # Restrict python to run_demo.py only
        if parts[0] in ("python", "python3"):
            if len(parts) < 2 or not parts[1].endswith('run_demo.py'):
                raise HTTPException(400, 'Only run_demo.py is allowed')
        res = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True, timeout=15)
        return {"ok": True, "code": res.returncode, "stdout": res.stdout, "stderr": res.stderr}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, 'Exec failed')


