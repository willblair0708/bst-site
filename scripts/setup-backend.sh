#!/usr/bin/env bash
set -euo pipefail

# Setup and launch the Runix backend + test via CLI
# Usage:
#   bash scripts/setup-backend.sh [--fake] [--key sk-...] [--port 8787] [--agent SCOUT] [--sample "query..."] [--no-start]

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
VENV_DIR="$ROOT_DIR/.venv"
BACKEND_DIR="$ROOT_DIR/apps/backend"
PORT="8787"
FAKE="0"
API_KEY=""
AGENT="SCOUT"
SAMPLE_QUERY="Summarize CRISPR off-target effects with citations"
START_SERVER="1"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --fake)
      FAKE="1"; shift;;
    --key)
      API_KEY="${2:-}"; shift 2;;
    --port)
      PORT="${2:-8787}"; shift 2;;
    --agent)
      AGENT="${2:-SCOUT}"; shift 2;;
    --sample)
      SAMPLE_QUERY="${2:-$SAMPLE_QUERY}"; shift 2;;
    --no-start)
      START_SERVER="0"; shift;;
    *)
      echo "Unknown arg: $1" >&2; exit 2;;
  esac
done

echo "[setup] repo: $ROOT_DIR"
echo "[setup] venv: $VENV_DIR"
echo "[setup] backend: $BACKEND_DIR"
echo "[setup] port: $PORT"

if [[ ! -d "$VENV_DIR" ]]; then
  echo "[setup] creating venv..."
  python3 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"
python3 -m pip install --upgrade pip >/dev/null

echo "[setup] installing backend (editable)..."
pip install -e "$BACKEND_DIR" >/dev/null

BASE_URL="http://localhost:$PORT"

if [[ "$START_SERVER" == "1" ]]; then
  # Try to load OPENAI_API_KEY from backend .env files if not provided
  if [[ -z "$API_KEY" && -z "${OPENAI_API_KEY:-}" ]]; then
    if [[ -f "$BACKEND_DIR/.env" ]]; then
      echo "[setup] loading env from $BACKEND_DIR/.env"
      set -a; source "$BACKEND_DIR/.env"; set +a
    fi
    if [[ -z "${OPENAI_API_KEY:-}" && -f "$BACKEND_DIR/app/.env" ]]; then
      echo "[setup] loading env from $BACKEND_DIR/app/.env"
      set -a; source "$BACKEND_DIR/app/.env"; set +a
    fi
  fi
  echo "[setup] ensuring port $PORT is free..."
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "[setup] killing process on $PORT"
    lsof -nP -iTCP:"$PORT" -sTCP:LISTEN | awk 'NR>1{print $2}' | sort -u | xargs -r kill -9 || true
  fi

  echo "[setup] starting backend..."
  (
    cd "$BACKEND_DIR"
    if [[ "$FAKE" == "1" ]]; then
      RUNIX_FAKE_OAI=1 uvicorn app.main:app --host 0.0.0.0 --port "$PORT" --reload > "$ROOT_DIR/backend.log" 2>&1 &
    else
      if [[ -z "$API_KEY" && -z "${OPENAI_API_KEY:-}" ]]; then
        echo "[error] Provide --key sk-... or set OPENAI_API_KEY env" >&2
        exit 1
      fi
      OPENAI_API_KEY="${API_KEY:-${OPENAI_API_KEY:-}}" uvicorn app.main:app --host 0.0.0.0 --port "$PORT" --reload > "$ROOT_DIR/backend.log" 2>&1 &
    fi
    echo $! > "$ROOT_DIR/.runix_backend.pid"
  )

  echo -n "[setup] waiting for health"
  for i in {1..50}; do
    if curl -sS "$BASE_URL/health" >/dev/null; then
      echo " - OK"; break
    fi
    echo -n "."; sleep 0.2
    if [[ $i -eq 50 ]]; then
      echo "\n[error] backend did not become healthy. See $ROOT_DIR/backend.log" >&2
      exit 1
    fi
  done
fi

echo "[setup] agents available:"
runix-agents list --base-url "$BASE_URL" || true

echo "[setup] sample task ($AGENT): $SAMPLE_QUERY"
runix-agents task "$AGENT" "$SAMPLE_QUERY" --base-url "$BASE_URL" --stream || true

cat <<EOF

Done.

Server logs: $ROOT_DIR/backend.log
Stop server:  if [[ -f "$ROOT_DIR/.runix_backend.pid" ]]; then kill -9 "$(cat "$ROOT_DIR/.runix_backend.pid")"; fi
CLI examples:
  runix-agents list --base-url $BASE_URL
  runix-agents task SCOUT "What are recent primary sources on AlphaFold accuracy?" --stream --base-url $BASE_URL
  runix-agents task ALCHEMIST "Propose 3 SMILES for kinase inhibition with rationale" --base-url $BASE_URL

EOF


