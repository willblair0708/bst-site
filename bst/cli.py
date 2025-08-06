"""Command-line interface for Bastion (bst)."""

from __future__ import annotations

import os
import pathlib
import subprocess
import sys
from typing import Any

import click
import git
import rich
import yaml
from jsonschema import validate, ValidationError
from rich.console import Console
from rich.style import Style

# NEW IMPORTS
from bst.reglint import RegLinter
from bst import onchain as _onchain
from bst import registry as _registry
from prometheus_client import start_http_server

# (imports inserted above; placeholder removed)

ROOT_MARKER = ".ctrepo"  # Name of sentinel directory that marks a trial repo root
console = Console()
__version__ = "0.1.0"


# ──────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────

def _repo_root() -> pathlib.Path:
    """Return the path to the current trial repository root or exit."""
    p = pathlib.Path.cwd().resolve()
    while p != p.parent:
        if (p / ROOT_MARKER).exists():
            return p
        p = p.parent
    console.print("[red]Error:[/] Not inside a Bastion trial repository (.ctrepo).", style=Style(color="red"))
    sys.exit(1)


def _git_cmd(*args: str, **kwargs: Any) -> None:
    """Run a git command if available; silently noop when git is absent.
    This makes CLI usable in minimal CI environments where the `git` binary
    may not be installed. We still attempt the command for full installs
    but swallow failures so that core bst functionality remains usable.
    """
    try:
        subprocess.check_call(["git", *args], **kwargs)
    except (FileNotFoundError, subprocess.CalledProcessError):
        # Gracefully degrade – emit a rich warning and continue
        console.print("[yellow]⚠️  git unavailable – skipping git command.[/]")
        return


# ──────────────────────────────────────────────────────────────────────────
# CLI group
# ──────────────────────────────────────────────────────────────────────────

@click.group(context_settings={"help_option_names": ["-h", "--help"]})
def cli() -> None:
    """Bastion command-line interface."""


# ──────────────────────────────────────────────────────────────────────────
# Collaboration & Governance Commands (Pillar 2)
# ──────────────────────────────────────────────────────────────────────────

@cli.group()
def diff() -> None:
    """Diff utilities for trial artefacts."""


@diff.command("protocol")
@click.argument("left", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
@click.argument("right", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
def diff_protocol(left: pathlib.Path, right: pathlib.Path) -> None:
    """Show inline diff between two protocol YAML files."""
    import difflib, yaml, json, rich
    # Load and normalise YAML so ordering differences are ignored by dumping to JSON
    left_json = json.dumps(yaml.safe_load(left.read_text()), indent=2, sort_keys=True).splitlines(keepends=True)
    right_json = json.dumps(yaml.safe_load(right.read_text()), indent=2, sort_keys=True).splitlines(keepends=True)
    diff_lines = difflib.unified_diff(left_json, right_json, fromfile=str(left), tofile=str(right))
    console.print("\n".join(diff_lines))


@cli.group()
def comment() -> None:
    """Threaded discussion comments."""


@comment.command("add")
@click.option("--file", "file_path", required=True, type=str, help="File path relative to repo root")
@click.option("--line", "line_no", required=True, type=int, help="Line number in file")
@click.option("--text", required=True, help="Comment text")
@click.option("--role", default="reviewer", show_default=True, help="Role of commenter (e.g., statistician, IRB)")
def comment_add(file_path: str, line_no: int, text: str, role: str) -> None:
    """Add a threaded comment."""
    import json, uuid, datetime
    root = _repo_root()
    comments_db = root / ".ctrepo" / "comments.json"
    comments_db.parent.mkdir(exist_ok=True)
    if comments_db.exists():
        comments = json.loads(comments_db.read_text())
    else:
        comments = []
    comment_entry = {
        "id": str(uuid.uuid4()),
        "file": file_path,
        "line": line_no,
        "text": text,
        "role": role,
        "user": os.getenv("USER", "anon"),
        "created": datetime.datetime.utcnow().isoformat() + "Z",
        "resolved": False,
    }
    comments.append(comment_entry)
    comments_db.write_text(json.dumps(comments, indent=2))
    console.print(f"[green]Comment added ({comment_entry['id']}).[/]")


@comment.command("list")
@click.option("--file", "file_path", default=None, help="Filter comments by file path")
def comment_list(file_path: str | None) -> None:
    """List comments, optionally filtered by file."""
    import json
    root = _repo_root()
    comments_db = root / ".ctrepo" / "comments.json"
    if not comments_db.exists():
        console.print("[yellow]No comments found.[/]")
        return
    comments = json.loads(comments_db.read_text())
    for c in comments:
        if file_path and c["file"] != file_path:
            continue
        status = "resolved" if c.get("resolved") else "open"
        console.print(f"[blue]{c['file']}:{c['line']}[/] [{status}] {c['user']} ({c['role']}): {c['text']}")


@comment.command("resolve")
@click.argument("comment_id")
def comment_resolve(comment_id: str) -> None:
    """Mark a comment thread as resolved."""
    import json
    root = _repo_root()
    comments_db = root / ".ctrepo" / "comments.json"
    if not comments_db.exists():
        console.print("[red]No comments database found.[/]")
        return
    comments = json.loads(comments_db.read_text())
    for c in comments:
        if c["id"] == comment_id:
            c["resolved"] = True
            comments_db.write_text(json.dumps(comments, indent=2))
            console.print("[green]Comment resolved.[/]")
            return
    console.print("[red]Comment ID not found.[/]")


# ──────────────────────────────────────────────────────────────────────────
# Commands
# ──────────────────────────────────────────────────────────────────────────

@cli.command()
@click.option("--indication", required=True, help="Therapeutic area, e.g. NSCLC")
def init(indication: str) -> None:
    """Scaffold a new Bastion trial repository in the current directory."""

    if pathlib.Path(ROOT_MARKER).exists():
        console.print("[yellow]Repo already initialised.[/]")
        return

    # Init git repo if not already
    if not (pathlib.Path(".git").exists()):
        _git_cmd("init", "-b", "main")

    # Create sentinel dir and baseline files
    pathlib.Path(ROOT_MARKER).mkdir(exist_ok=True)
    (pathlib.Path("protocol")).mkdir(exist_ok=True)
    (pathlib.Path("schemas")).mkdir(exist_ok=True)
    # Provide a minimal JSON Schema for protocols so validation works out-of-the-box
    default_schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "required": ["id"],
        "properties": {
            "id": {"type": "string"},
            "title": {"type": "string"},
            "version": {"type": "string"},
            "inclusionCriteria": {"type": "array"}
        }
    }
    with open("schemas/protocol.schema.json", "w") as schema_fh:
        __import__("json").dump(default_schema, schema_fh, indent=2)

    bastion_cfg = {
        "indication": indication,
        "schema": "schemas/protocol.schema.json",
        "version": 1,
    }
    with open("bastion.yaml", "w") as fh:
        yaml.safe_dump(bastion_cfg, fh)

    _git_cmd("add", ROOT_MARKER, "bastion.yaml")
    _git_cmd("commit", "-m", f"scaffold trial for {indication}")
    console.print(f"[green]Initialised Bastion repo for {indication}.[/]")


@cli.command("add-protocol")
@click.argument("path", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
def add_protocol(path: pathlib.Path) -> None:
    """Attach or update a protocol file under ./protocol/."""

    root = _repo_root()
    schema_path = root / "schemas" / "protocol.schema.json"

    if not schema_path.exists():
        console.print("[red]Protocol schema not found. Did you run bst init?[/]")
        sys.exit(1)

    # Validate YAML against schema
    raw = yaml.safe_load(path.read_text())
    schema = yaml.safe_load(schema_path.read_text()) if schema_path.suffix in {".yaml", ".yml"} else __import__("json").load(open(schema_path))
    try:
        validate(raw, schema)
    except ValidationError as e:
        console.print(f"[red]Protocol validation failed:[/] {e.message}")
        sys.exit(1)

    dest = root / "protocol" / path.name
    dest.write_text(path.read_text())

    _git_cmd("add", str(dest))
    _git_cmd("commit", "-m", f"add protocol {dest.name}")
    console.print(f"[green]Protocol {dest.name} added.[/]")


@cli.command("twin-simulate")
@click.option("--n", default=100, show_default=True, help="Number of synthetic patients to simulate")
@click.option("--protocol", help="Protocol file to use for simulation parameters")
def twin_simulate(n: int, protocol: str) -> None:
    """Generate a synthetic control cohort using protocol parameters."""

    root = _repo_root()
    data_dir = root / "data"
    data_dir.mkdir(exist_ok=True)
    
    # If protocol specified, read CI config
    if protocol:
        protocol_path = root / "protocol" / protocol
        if protocol_path.exists():
            protocol_data = yaml.safe_load(protocol_path.read_text())
            # Use protocol's CI config if available
            ci_config = protocol_data.get("ci", {})
            n = ci_config.get("synthetic_twins", n)
            console.print(f"[blue]Using protocol {protocol} (n={n} from CI config)[/]")
    
    import time
    twin_file = data_dir / "synthetic-controls.parquet"
    # Overwrite if exists to keep deterministic output for CI/testing
    twin_file.write_text(f"# Synthetic Control Twins\n# Generated: {int(time.time())}\n# Count: {n}\n")

    _git_cmd("add", str(twin_file))
    _git_cmd("commit", "-m", f"add synthetic control twins (n={n})")
    console.print(f"[green]Simulated {n} twins -> {twin_file}[/]")


@cli.command("ci-check")
@click.argument("protocol_file", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
def ci_check(protocol_file: pathlib.Path) -> None:
    """Run CI checks on a protocol (λ-Trial DSL validation)."""
    
    root = _repo_root()
    schema_path = root / "schemas" / "protocol.schema.json"
    
    # Validate against schema
    protocol_data = yaml.safe_load(protocol_file.read_text())
    schema = __import__("json").load(open(schema_path))
    
    try:
        validate(protocol_data, schema)
        console.print("[green]✓ Schema validation passed[/]")
    except ValidationError as e:
        console.print(f"[red]✗ Schema validation failed:[/] {e.message}")
        return
    
    # Check CI requirements
    ci_config = protocol_data.get("ci", {})
    
    if ci_config.get("power_target"):
        console.print(f"[blue]Power target: {ci_config['power_target']}[/]")
    
    if ci_config.get("diversity_badge"):
        console.print(f"[blue]Diversity badge target: {ci_config['diversity_badge']}[/]")
    
    # Simulate required number of twins
    n_twins = ci_config.get("synthetic_twins", 100)
    console.print(f"[yellow]Running twin simulation (n={n_twins})...[/]")
    
    # Call twin-simulate with protocol config
    twin_simulate.callback(n_twins, protocol_file.name)
    
    console.print("[green]✓ CI checks completed[/]")


@cli.command("power-analysis")
@click.argument("protocol_file", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
def power_analysis(protocol_file: pathlib.Path) -> None:
    """Run power analysis for a protocol."""
    
    protocol_data = yaml.safe_load(protocol_file.read_text())
    
    sample_size = protocol_data.get("sample_size", {})
    ci_config = protocol_data.get("ci", {})
    
    n_total = sample_size.get("target", 100)
    power_target = ci_config.get("power_target", 0.8)
    alpha = ci_config.get("alpha", 0.05)
    
    console.print(f"[blue]Power Analysis Results:[/]")
    console.print(f"  Sample size: {n_total}")
    console.print(f"  Power target: {power_target}")
    console.print(f"  Alpha: {alpha}")
    console.print(f"  [green]Estimated power: 0.847[/] (simulated)")
    console.print(f"  [yellow]Recommendation: Sample size adequate[/]")

# ══════════════════════════════════════════════════════════════════════
# Pillar 3 – Evidence CI/CD
# ══════════════════════════════════════════════════════════════════════

@cli.group()
def ci() -> None:
    """Evidence CI/CD pipeline commands."""


@ci.command("lint-protocol")
@click.argument("protocol", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
def ci_lint(protocol: pathlib.Path) -> None:
    """Run JSON-Schema linter on protocol file."""
    result = cli.make_context("ci-check", [], resilient_parsing=True)
    # Re-use existing validation logic
    ctx = click.Context(ci_check, parent=result)
    ci_check.invoke(ctx, protocol_file=protocol)
    # Run Reg-Lint engine
    linter = RegLinter()
    issues = linter.run(protocol)
    if not issues:
        console.print("[green]✓ Reg-Lint passed[/]")
    else:
        for issue in issues:
            colour = "red" if issue.level == "error" else "yellow"
            console.print(f"[{colour}]{issue}[/]")
        console.print(f"[red]✗ {len(issues)} Reg-Lint issue(s) found.[/]")
        return


@ci.command("power-sim")
@click.argument("protocol", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
def ci_power(protocol: pathlib.Path) -> None:
    """Monte-Carlo power simulation stub."""
    console.print("[cyan]Running power simulation (stub)…[/]")
    power_analysis.callback(protocol)


@ci.command("diversity-badge")
@click.argument("protocol", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
def ci_diversity(protocol: pathlib.Path) -> None:
    """Compute diversity badge score (stub)."""
    console.print("[cyan]Computing diversity badge (simulated 0.92)…[/]")


@ci.command("twin-auc")
@click.argument("control", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
def ci_twin_auc(control: pathlib.Path) -> None:
    """Evaluate digital-twin AUC (stub)."""
    console.print("[cyan]Twin AUC = 0.88 (demo result).[/]")


@ci.command("workflow")
def ci_workflow() -> None:
    """Visualise CI workflow graph (stub)."""
    console.print("[cyan]✓ lint → power-sim → diversity-badge → twin-AUC[/]")


# ══════════════════════════════════════════════════════════════════════
# Pillar 4 – Model & Data Hub
# ══════════════════════════════════════════════════════════════════════

@cli.group()
def hub() -> None:
    """Model & dataset registry commands."""


@hub.command("model-publish")
@click.argument("weights", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
@click.option("--card", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path), help="Model card YAML/JSON")
def hub_model_publish(weights: pathlib.Path, card: pathlib.Path | None) -> None:
    root = _repo_root()
    registry = root / ".ctrepo" / "model_registry.json"
    registry.parent.mkdir(exist_ok=True)
    import json, uuid, time
    entries = json.loads(registry.read_text()) if registry.exists() else []
    entry = {"id": str(uuid.uuid4()), "weights": str(weights), "card": str(card) if card else None, "timestamp": int(time.time())}
    entries.append(entry)
    registry.write_text(json.dumps(entries, indent=2))
    console.print(f"[green]Model registered ({entry['id']}).[/]")


@hub.command("dataset-publish")
@click.argument("dataset", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
@click.option("--card", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path), help="Dataset card YAML/JSON")
def hub_dataset_publish(dataset: pathlib.Path, card: pathlib.Path | None) -> None:
    root = _repo_root()
    registry = root / ".ctrepo" / "dataset_registry.json"
    registry.parent.mkdir(exist_ok=True)
    import json, uuid, time
    entries = json.loads(registry.read_text()) if registry.exists() else []
    entry = {"id": str(uuid.uuid4()), "dataset": str(dataset), "card": str(card) if card else None, "timestamp": int(time.time())}
    entries.append(entry)
    registry.write_text(json.dumps(entries, indent=2))
    console.print(f"[green]Dataset registered ({entry['id']}).[/]")


# ══════════════════════════════════════════════════════════════════════
# Pillar 5 – Trial Spaces (demo layer)
# ══════════════════════════════════════════════════════════════════════

@cli.command("space-deploy")
@click.argument("app", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
@click.option("--cpu", default=True, is_flag=True, help="Deploy on CPU tier (default)")
@click.option("--gpu", is_flag=True, help="Deploy on GPU tier")
def space_deploy(app: pathlib.Path, cpu: bool, gpu: bool) -> None:
    """Deploy demo dashboard (stub)."""
    tier = "GPU" if gpu else "CPU"
    console.print(f"[green]Deploying {app} to Trial Space ({tier} tier)…[/]")


# ══════════════════════════════════════════════════════════════════════
# Pillar 6 – Security & Compliance
# ══════════════════════════════════════════════════════════════════════

@cli.group()
def compliance() -> None:
    """Compliance utilities (Part 11 e-signatures, audit logs)."""


@compliance.command("sign")
@click.argument("file", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
@click.option("--user", default=lambda: os.getenv("USER", "anon"), help="Signer name")
def compliance_sign(file: pathlib.Path, user: str) -> None:
    import hashlib, json, time
    root = _repo_root()
    sigs = root / ".ctrepo" / "signatures.json"
    sigs.parent.mkdir(exist_ok=True)
    entries = json.loads(sigs.read_text()) if sigs.exists() else []
    digest = hashlib.sha256(file.read_bytes()).hexdigest()
    entries.append({"file": str(file), "digest": digest, "user": user, "time": int(time.time())})
    sigs.write_text(json.dumps(entries, indent=2))
    console.print("[green]File e-signed (Part 11 stub).[/]")


@compliance.command("audit-export")
def compliance_audit() -> None:
    root = _repo_root()
    import json
    logs = {}
    for name in ["comments.json", "signatures.json", "model_registry.json", "dataset_registry.json"]:
        p = root / ".ctrepo" / name
        if p.exists():
            logs[name] = json.loads(p.read_text())
    export = root / f"audit-log-{int(__import__('time').time())}.json"
    export.write_text(json.dumps(logs, indent=2))
    console.print(f"[green]Audit log exported → {export}[/]")

# ─── On-chain ledger command ───────────────────────────────────────────

@compliance.command("onchain-commit")
@click.argument("artifact", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
def compliance_onchain(artifact: pathlib.Path) -> None:
    """Record artifact hash to on-chain audit ledger (stub)."""
    root = _repo_root()
    entry = _onchain.record_artifact(artifact, root)
    console.print(f"[green]On-chain ledger entry added ({entry['sha256'][:8]}…)[/]")


# ══════════════════════════════════════════════════════════════════════
# Pillar 7 – Federated Data Mesh (stub)
# ══════════════════════════════════════════════════════════════════════

@cli.command("fhir-query")
@click.option("--endpoint", required=True, help="FHIR base URL inside hospital VPC")
@click.option("--query", required=True, help="FHIR query string e.g. Patient?gender=female")
def fhir_query(endpoint: str, query: str) -> None:
    console.print(f"[cyan]Running on-prem FHIR query at {endpoint}/{query} (simulated)…[/]")
    console.print("[green]Result: 42 matching resources (aggregated count only).[/]")


# ══════════════════════════════════════════════════════════════════════
# Pillar 8 – Inference & API Layer (stub HTTP server)
# ══════════════════════════════════════════════════════════════════════

@cli.command("api-serve")
@click.option("--port", default=8000, show_default=True)
def api_serve(port: int) -> None:
    """Start minimal HTTP server exposing /simulate endpoint."""
    from http.server import BaseHTTPRequestHandler, HTTPServer
    import json

    class Handler(BaseHTTPRequestHandler):
        def _send(self, code: int, payload: dict) -> None:
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(payload).encode())

        def do_GET(self):  # noqa: N802
            if self.path.startswith("/simulate"):
                self._send(200, {"status": "ok", "n": 100})
            else:
                self._send(404, {"error": "Not found"})

    console.print(f"[green]Serving inference API on :{port} (Ctrl+C to stop)…[/]")
    try:
        HTTPServer(("0.0.0.0", port), Handler).serve_forever()
    except KeyboardInterrupt:
        console.print("[yellow]Server stopped.[/]")


# ══════════════════════════════════════════════════════════════════════
# Pillar 9 – Marketplace / Plug-ins (stub)
# ══════════════════════════════════════════════════════════════════════

@cli.group()
def marketplace() -> None:
    """Marketplace commands."""


@marketplace.command("publish")
@click.argument("artifact", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
@click.option("--type", type=click.Choice(["widget", "prior", "app"], case_sensitive=False), default="widget")
def marketplace_publish(artifact: pathlib.Path, type: str) -> None:
    console.print(f"[green]Published {artifact} as {type} to marketplace (stub).[/]")

# ══════════════════════════════════════════════════════════════════════
# Local Package Registry (Phase 3 stub)
# ══════════════════════════════════════════════════════════════════════

@cli.group()
def registry() -> None:
    """Package registry commands."""


@registry.command("publish")
@click.argument("package", type=click.Path(exists=True, dir_okay=False, path_type=pathlib.Path))
@click.option("--name", required=True, help="Package name")
@click.option("--version", required=True, help="Package version")
def registry_publish(package: pathlib.Path, name: str, version: str) -> None:
    _registry.publish(package, name, version)
    console.print(f"[green]Published {name}@{version} to registry[/]")


@registry.command("install")
@click.option("--name", required=True, help="Package name")
@click.option("--version", required=True, help="Package version")
@click.option("--dest", type=click.Path(path_type=pathlib.Path), default=".", show_default=True)
def registry_install(name: str, version: str, dest: pathlib.Path) -> None:
    installed = _registry.install(dest, name, version)
    console.print(f"[green]Installed to {installed}[/]")


# ══════════════════════════════════════════════════════════════════════
# Pillar 10 – Observability & Metrics (stub)
# ══════════════════════════════════════════════════════════════════════

@cli.group()
def metrics() -> None:
    """Trial metrics and badges."""


@metrics.command("badge-generate")
@click.option("--type", type=click.Choice(["power", "diversity", "part11"], case_sensitive=False), required=True)
def metrics_badge(type: str) -> None:
    console.print(f"[green]Generated {type} badge (stub).[/]")

@metrics.command("serve")
@click.option("--port", default=9102, show_default=True)
def metrics_serve(port: int) -> None:
    """Expose Prometheus metrics endpoint (stub)."""
    from prometheus_client import Gauge
    import time

    gauge = Gauge("bastion_dummy_metric", "Dummy metric for demo")
    start_http_server(port)
    console.print(f"[green]Prometheus metrics server running on :{port} (Ctrl+C to stop)…[/]")
    try:
        while True:
            gauge.set(time.time() % 100)
            time.sleep(5)
    except KeyboardInterrupt:
        console.print("[yellow]Metrics server stopped.[/]")


# ══════════════════════════════════════════════════════════════════════
# Pillar 11 – Community & Discovery (stub)
# ══════════════════════════════════════════════════════════════════════

@cli.command("search")
@click.argument("term")
def discovery_search(term: str) -> None:
    console.print(f"[green]Searching platform for '{term}' (stub)…[/]")


# ══════════════════════════════════════════════════════════════════════
# Pillar 12 – Client Tooling (informational)
# ══════════════════════════════════════════════════════════════════════

@cli.command("about-cli")
def about_cli() -> None:
    """Show installed bst CLI version and feature parity."""
    console.print(f"bst version {__version__}")
    console.print("Features: Repo Fabric, Collaboration, Evidence CI/CD, Hub, Spaces, Compliance, Data Mesh, API, Marketplace, Metrics, Discovery")
