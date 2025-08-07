import os
import sqlite3
import uuid
import json
import time
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from openai import OpenAI
from app.tools.local import extract_citations
from app.agents.roles import TOOL_TRACE_CVAR

DB_PATH = os.getenv("RUNIX_TASKS_DB", os.path.join(os.path.dirname(__file__), "..", "tasks.db"))


def _connect():
    path = os.path.abspath(DB_PATH)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def _init_db():
    conn = _connect()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            agent TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            thread_id TEXT,
            run_id TEXT,
            answer_markdown TEXT
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT NOT NULL,
            author TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


_init_db()


def _now_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"


class CreateTaskRequest(BaseModel):
    agent: str
    query: str
    stream: Optional[bool] = False


router = APIRouter()

# Simple in-memory rate limiter (Phase 0)
_RATE_LIMIT: dict[str, list[float]] = {}
_RATE_LIMIT_MAX = int(os.getenv("RUNIX_RATE_LIMIT", "30"))
_RATE_WINDOW_S = 60.0


@router.post("/v1/tasks")
async def create_task(req: Request):
    body = await req.json()
    try:
        payload = CreateTaskRequest(**body)
    except Exception:
        return JSONResponse({"error": "Invalid request"}, status_code=400)

    # Rate limit per IP
    ip = (req.client.host if req.client else "unknown")
    now = time.time()
    buf = _RATE_LIMIT.get(ip, [])
    buf = [t for t in buf if now - t < _RATE_WINDOW_S]
    if len(buf) >= _RATE_LIMIT_MAX:
        return JSONResponse({"error": "Rate limit exceeded"}, status_code=429)
    buf.append(now)
    _RATE_LIMIT[ip] = buf

    auth = req.headers.get("authorization") or ""
    bearer = auth.split(" ", 1)[1] if auth.lower().startswith("bearer ") and len(auth.split(" ", 1)) > 1 else None
    fake = os.getenv("RUNIX_FAKE_OAI", "") == "1"
    api_key = bearer or os.getenv("OPENAI_API_KEY", "")
    if not api_key and not fake:
        return JSONResponse({"error": "Missing OpenAI API key"}, status_code=401)

    task_id = str(uuid.uuid4())
    # Size limits (Phase 0): reject overly long queries
    if len(payload.query or "") > 8000:
        return JSONResponse({"error": "Query too long"}, status_code=413)
    conn = _connect()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO tasks (id, agent, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        (task_id, payload.agent.upper(), "running", _now_iso(), _now_iso()),
    )
    cur.execute(
        "INSERT INTO messages (task_id, author, content, created_at) VALUES (?, ?, ?, ?)",
        (task_id, "User", payload.query, _now_iso()),
    )
    conn.commit()
    conn.close()

    client = OpenAI(api_key=api_key) if api_key else OpenAI()

    if payload.stream and not fake:
        def gen():
            from app.main import build_system_prompt  # lazy import

            buffer = ""
            yield "event: open\n\n"
            instructions = build_system_prompt(payload.agent)
            with client.responses.stream(
                model="gpt-4o-mini",
                instructions=instructions,
                input=f"User: {payload.query}\nAssistant:",
                temperature=0.2,
                max_output_tokens=1000,
            ) as stream:
                for event in stream:
                    etype = getattr(event, "type", "")
                    if etype == "response.output_text.delta":
                        delta = getattr(event, "delta", "") or ""
                        if delta:
                            buffer += delta
                            yield "data: " + json.dumps({"delta": delta}) + "\n\n"
                final_resp = stream.get_final_response()
                text = getattr(final_resp, "output_text", None) or buffer

            # persist final
            conn2 = _connect()
            cur2 = conn2.cursor()
            cur2.execute(
                "UPDATE tasks SET status=?, answer_markdown=?, updated_at=? WHERE id=?",
                ("succeeded", text, _now_iso(), task_id),
            )
            cur2.execute(
                "INSERT INTO messages (task_id, author, content, created_at) VALUES (?, ?, ?, ?)",
                (task_id, "AI", text, _now_iso()),
            )
            conn2.commit()
            conn2.close()

            final = {
                "done": True,
                "task_id": task_id,
                "message": {"id": 0, "author": "AI", "content": text},
                "citations": extract_citations(text or ""),
            }
            yield "data: " + json.dumps(final) + "\n\n"

        headers = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
        return StreamingResponse(gen(), media_type="text/event-stream", headers=headers)

    # Non-streaming path: prefer Agents SDK if available (unless fake mode)
    text = ""
    used_agents_sdk = False
    try:
        from app.agents.roles import get_agent  # type: ignore
        from agents import Runner  # type: ignore

        agent = get_agent(payload.agent)
        if agent is not None and not fake:
            TOOL_TRACE_CVAR.set([])
            result = Runner.run_sync(agent, payload.query, max_turns=12)
            text = getattr(result, "final_output", None) or ""
            used_agents_sdk = True
    except Exception:
        used_agents_sdk = False

    if fake:
        text = f"[FAKE] Answer to: {payload.query}\n\nReferences:\n[1] Example Study — 10.1000/example"
    elif not used_agents_sdk:
        from app.main import build_system_prompt  # lazy import
        resp = client.responses.create(
            model="gpt-4o-mini",
            instructions=build_system_prompt(payload.agent),
            input=f"User: {payload.query}\nAssistant:",
            temperature=0.2,
            max_output_tokens=1000,
        )
        text = getattr(resp, "output_text", "") or ""
    conn3 = _connect()
    cur3 = conn3.cursor()
    cur3.execute(
        "UPDATE tasks SET status=?, answer_markdown=?, updated_at=? WHERE id=?",
        ("succeeded", text, _now_iso(), task_id),
    )
    cur3.execute(
        "INSERT INTO messages (task_id, author, content, created_at) VALUES (?, ?, ?, ?)",
        (task_id, "AI", text, _now_iso()),
    )
    conn3.commit()
    conn3.close()
    return JSONResponse({
        "task_id": task_id,
        "status": "succeeded",
        "answer_markdown": text,
        "citations": extract_citations(text or ""),
        "tool_trace": TOOL_TRACE_CVAR.get() or [],
    }, status_code=202)


@router.get("/v1/tasks/{task_id}")
async def get_task(task_id: str):
    conn = _connect()
    cur = conn.cursor()
    cur.execute("SELECT * FROM tasks WHERE id=?", (task_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return JSONResponse({"error": "Not found"}, status_code=404)
    cur.execute("SELECT author, content, created_at FROM messages WHERE task_id=? ORDER BY id", (task_id,))
    msgs = [dict(r) for r in cur.fetchall()]
    conn.close()
    return {
        "task_id": row["id"],
        "agent": row["agent"],
        "status": row["status"],
        "answer_markdown": row["answer_markdown"],
        "citations": extract_citations((row["answer_markdown"] or "")),
        "tool_trace": [],
        "messages": msgs,
    }


class ContinueTaskRequest(BaseModel):
    message: str
    stream: Optional[bool] = False


@router.post("/v1/tasks/{task_id}/continue")
async def continue_task(task_id: str, req: Request):
    body = await req.json()
    try:
        payload = ContinueTaskRequest(**body)
    except Exception:
        return JSONResponse({"error": "Invalid request"}, status_code=400)

    auth = req.headers.get("authorization") or ""
    bearer = auth.split(" ", 1)[1] if auth.lower().startswith("bearer ") and len(auth.split(" ", 1)) > 1 else None
    api_key = bearer or os.getenv("OPENAI_API_KEY", "")
    if not api_key:
        return JSONResponse({"error": "Missing OpenAI API key"}, status_code=401)

    conn = _connect()
    cur = conn.cursor()
    cur.execute("SELECT * FROM tasks WHERE id=?", (task_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return JSONResponse({"error": "Not found"}, status_code=404)
    cur.execute("INSERT INTO messages (task_id, author, content, created_at) VALUES (?, ?, ?, ?)", (task_id, "User", payload.message, _now_iso()))
    conn.commit()
    # gather transcript
    cur.execute("SELECT author, content FROM messages WHERE task_id=? ORDER BY id", (task_id,))
    convo = cur.fetchall()
    conn.close()

    transcript = []
    for r in convo:
        role = "User" if r["author"] == "User" else "Assistant"
        transcript.append(f"{role}: {r['content']}")
    transcript.append("Assistant:")
    input_text = "\n".join(transcript)

    client = OpenAI(api_key=api_key)

    if payload.stream:
        def gen():
            buffer = ""
            yield "event: open\n\n"
            with client.responses.stream(
                model="gpt-4o-mini",
                input=input_text,
                temperature=0.2,
                max_output_tokens=1000,
            ) as stream:
                for event in stream:
                    if getattr(event, "type", "") == "response.output_text.delta":
                        delta = getattr(event, "delta", "") or ""
                        if delta:
                            buffer += delta
                            yield "data: " + json.dumps({"delta": delta}) + "\n\n"
                final_resp = stream.get_final_response()
                text = getattr(final_resp, "output_text", None) or buffer

            conn2 = _connect()
            cur2 = conn2.cursor()
            cur2.execute(
                "UPDATE tasks SET status=?, answer_markdown=?, updated_at=? WHERE id=?",
                ("succeeded", text, _now_iso(), task_id),
            )
            cur2.execute(
                "INSERT INTO messages (task_id, author, content, created_at) VALUES (?, ?, ?, ?)",
                (task_id, "AI", text, _now_iso()),
            )
            conn2.commit()
            conn2.close()

            yield "data: " + json.dumps({"done": True, "task_id": task_id}) + "\n\n"

        headers = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
        return StreamingResponse(gen(), media_type="text/event-stream", headers=headers)

    # non-stream
    resp = client.responses.create(
        model="gpt-4o-mini",
        input=input_text,
        temperature=0.2,
        max_output_tokens=1000,
    )
    text = getattr(resp, "output_text", "") or ""
    conn3 = _connect()
    cur3 = conn3.cursor()
    cur3.execute(
        "UPDATE tasks SET status=?, answer_markdown=?, updated_at=? WHERE id=?",
        ("succeeded", text, _now_iso(), task_id),
    )
    cur3.execute(
        "INSERT INTO messages (task_id, author, content, created_at) VALUES (?, ?, ?, ?)",
        (task_id, "AI", text, _now_iso()),
    )
    conn3.commit()
    conn3.close()
    return {"task_id": task_id, "status": "succeeded", "answer_markdown": text}


