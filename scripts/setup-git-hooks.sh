#!/usr/bin/env bash
# Install pre-commit hook for audit trail maintenance
set -euo pipefail

root=$(git rev-parse --show-toplevel)
hook_target="$root/.git/hooks/pre-commit"

if [[ -f "$hook_target" ]]; then
    echo "Pre-commit hook already exists. Backing up to pre-commit.bak"
    mv "$hook_target" "$hook_target.bak"
fi

cp "$root/scripts/precommit.sh" "$hook_target"
chmod +x "$hook_target"

echo "✓ Pre-commit hook installed successfully"
echo "The hook will maintain an audit trail of all commits in .ctrepo/audit.log"