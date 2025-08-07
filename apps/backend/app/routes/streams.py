from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import os
import sqlite3
import time
import json

router = APIRouter()

DB_PATH = os.getenv("RUNIX_TASKS_DB", os.path.join(os.path.dirname(__file__), "..", "tasks.db"))


def _connect():
    path = os.path.abspath(DB_PATH)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


@router.get("/v1/streams/tasks/{task_id}")
async def stream_task(task_id: str):
    def gen():
        yield "event: open\n\n"
        conn = _connect()
        cur = conn.cursor()
        cur.execute("SELECT author, content, created_at FROM messages WHERE task_id=? ORDER BY id", (task_id,))
        rows = cur.fetchall()
        for r in rows:
            payload = {"message": {"author": r["author"], "content": r["content"], "at": r["created_at"]}}
            yield "data: " + json.dumps(payload) + "\n\n"
        conn.close()
        yield "data: " + json.dumps({"done": True, "task_id": task_id}) + "\n\n"
    headers = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    return StreamingResponse(gen(), media_type="text/event-stream", headers=headers)