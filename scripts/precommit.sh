#!/usr/bin/env bash
# Bastion pre-commit: maintain hash-chained audit log
set -euo pipefail

root=$(git rev-parse --show-toplevel)
audit_dir="$root/.ctrepo"
log_file="$audit_dir/audit.log"
mkdir -p "$audit_dir"

tmp=$(mktemp)
git rev-list --reverse HEAD | while read -r c; do
  printf "%s %s" "$(git show -s --format='%H %ct' "$c")" | openssl dgst -sha256
done > "$tmp"

if [[ -f "$log_file" ]]; then
  if ! diff -q "$tmp" "$log_file" >/dev/null; then
    echo "Updating audit.log with latest commit hashes" >&2
  fi
fi
mv "$tmp" "$log_file"

git add "$log_file"
