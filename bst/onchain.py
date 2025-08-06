from __future__ import annotations

"""On-chain audit logging stubs for Bastion.

In production this would commit Merkle roots to a permissioned blockchain such
as Hyperledger Fabric. For demo purposes we persist a JSON ledger in the
`.ctrepo` folder.
"""

import json
import hashlib
import time
from pathlib import Path
from typing import Dict, Any

__all__ = ["record_artifact"]


def _ledger_path(repo_root: Path) -> Path:
    return repo_root / ".ctrepo" / "onchain_ledger.json"


def record_artifact(artifact: Path, repo_root: Path) -> Dict[str, Any]:
    """Record an artifact's hash to the on-chain ledger (stub).

    Returns the ledger entry created.
    """
    repo_root.mkdir(exist_ok=True, parents=True)
    ledger_file = _ledger_path(repo_root)
    ledger: list[dict[str, Any]] = (
        json.loads(ledger_file.read_text()) if ledger_file.exists() else []
    )

    digest = hashlib.sha256(artifact.read_bytes()).hexdigest()
    entry = {
        "artifact": str(artifact),
        "sha256": digest,
        "timestamp": int(time.time()),
    }
    ledger.append(entry)
    ledger_file.write_text(json.dumps(ledger, indent=2))
    return entry