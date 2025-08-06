from __future__ import annotations

"""Simple file-based package registry for Bastion.

This serves as a placeholder for a full-featured package index (Phase 3 of the
roadmap).
"""

import json
import shutil
from pathlib import Path
from typing import Dict, Any

REGISTRY_FILE = Path.home() / ".bastion" / "registry.json"
REGISTRY_FILE.parent.mkdir(parents=True, exist_ok=True)


def _load_registry() -> Dict[str, Any]:
    if REGISTRY_FILE.exists():
        return json.loads(REGISTRY_FILE.read_text())
    return {}


def _save_registry(reg: Dict[str, Any]) -> None:
    REGISTRY_FILE.write_text(json.dumps(reg, indent=2))


# ----------------------------------------------------------------------
# Public API
# ----------------------------------------------------------------------

def publish(package_path: Path, name: str, version: str) -> None:
    reg = _load_registry()
    pkg_key = f"{name}:{version}"
    reg[pkg_key] = str(package_path.resolve())
    _save_registry(reg)


def install(target_dir: Path, name: str, version: str) -> Path:
    reg = _load_registry()
    pkg_key = f"{name}:{version}"
    if pkg_key not in reg:
        raise KeyError(f"Package {pkg_key} not found in registry")
    src = Path(reg[pkg_key])
    dest = target_dir / src.name
    shutil.copy2(src, dest)
    return dest