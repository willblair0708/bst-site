from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import os
import sqlite3

router = APIRouter()

DB_PATH = os.getenv("RUNIX_TASKS_DB", os.path.join(os.path.dirname(__file__), "..", "tasks.db"))


def _connect():
    path = os.path.abspath(DB_PATH)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


@router.get("/v1/evidence")
async def list_evidence(task_id: str | None = None):
    conn = _connect()
    cur = conn.cursor()
    if task_id:
        cur.execute("SELECT * FROM evidence WHERE task_id=? ORDER BY id", (task_id,))
    else:
        cur.execute("SELECT * FROM evidence ORDER BY id DESC LIMIT 200")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return {"evidence": rows}