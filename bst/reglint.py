from __future__ import annotations

"""Reg-Lint engine for Bastion clinical trial protocols.

Provides static analysis rules to ensure protocols include critical regulatory
components (e.g., informed consent, criteria completeness, data-privacy
annotations).
"""

from dataclasses import dataclass
from pathlib import Path
from typing import List, Dict, Any
import time
import hashlib
import yaml


@dataclass
class LintIssue:
    rule_id: str
    message: str
    level: str  # "error" | "warning"

    def __str__(self) -> str:  # pragma: no cover
        emoji = "✗" if self.level == "error" else "⚠"
        return f"{emoji} [{self.level}] {self.rule_id}: {self.message}"


class RegLinter:
    """Reg-Lint engine.

    Usage::
        issues = RegLinter().run(Path("protocol.yaml"))
    """

    def __init__(self) -> None:
        # Registry of rule callables
        self._rules: Dict[str, callable[[Dict[str, Any]], List[LintIssue]]] = {
            "R001": self._rule_informed_consent,
            "R002": self._rule_inclusion_exclusion,
            "R003": self._rule_phi_annotations,
        }

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def run(self, yaml_path: Path) -> List[LintIssue]:
        """Run all lint rules on a YAML protocol file."""
        protocol = yaml.safe_load(yaml_path.read_text())
        issues: List[LintIssue] = []
        for rule_id, fn in self._rules.items():
            issues.extend(fn(protocol))
        return issues

    # ------------------------------------------------------------------
    # Rule implementations
    # ------------------------------------------------------------------
    def _rule_informed_consent(self, proto: Dict[str, Any]) -> List[LintIssue]:
        if proto.get("informedConsent"):
            return []
        return [
            LintIssue(
                rule_id="R001",
                message="Protocol is missing an informedConsent section.",
                level="error",
            )
        ]

    def _rule_inclusion_exclusion(self, proto: Dict[str, Any]) -> List[LintIssue]:
        population = proto.get("population", {})
        inclusion = population.get("inclusionCriteria")
        exclusion = population.get("exclusionCriteria")
        issues: List[LintIssue] = []
        if not inclusion:
            issues.append(
                LintIssue(
                    rule_id="R002",
                    message="Missing inclusionCriteria in population section.",
                    level="error",
                )
            )
        if not exclusion:
            issues.append(
                LintIssue(
                    rule_id="R002",
                    message="Missing exclusionCriteria in population section.",
                    level="error",
                )
            )
        return issues

    def _rule_phi_annotations(self, proto: Dict[str, Any]) -> List[LintIssue]:
        dataspec = proto.get("dataCollection", [])
        issues: List[LintIssue] = []
        for item in dataspec:
            if "phi" in item.get("tags", []):
                if "phiTag" not in item:
                    issues.append(
                        LintIssue(
                            rule_id="R003",
                            message=f"Data element '{item.get('name', 'unknown')}' is deemed PHI but missing phiTag annotation.",
                            level="warning",
                        )
                    )
        return issues


# ----------------------------------------------------------------------
# Helper for Merkle root computation (simple concatenation + sha256)
# ----------------------------------------------------------------------

def merkle_hash(hashes: List[str]) -> str:
    """Compute a Merkle root of input payload hashes (very simplified)."""
    if not hashes:
        return ""
    current = hashes
    while len(current) > 1:
        it = iter(current)
        next_level = []
        for left in it:
            right = next(it, left)  # Duplicate last if odd count
            next_level.append(
                hashlib.sha256((left + right).encode()).hexdigest()
            )
        current = next_level
    return current[0]


# ----------------------------------------------------------------------
# CLI entry for standalone usage (dev/debug)
# ----------------------------------------------------------------------


def _main() -> None:  # pragma: no cover
    import argparse
    parser = argparse.ArgumentParser(description="Run Reg-Lint on a protocol file")
    parser.add_argument("protocol_yaml", type=Path)
    args = parser.parse_args()
    linter = RegLinter()
    issues = linter.run(args.protocol_yaml)
    if not issues:
        print("✓ No Reg-Lint issues found")
    else:
        for issue in issues:
            print(issue)
        print(f"{len(issues)} issue(s) found.")


if __name__ == "__main__":
    _main()