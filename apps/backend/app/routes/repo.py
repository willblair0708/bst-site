import os
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Literal, Optional

router = APIRouter()

BST_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
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


