import os
from typing import List, Literal, Optional

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from fastapi.responses import StreamingResponse, JSONResponse

load_dotenv()

DEFAULT_OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

app = FastAPI(title="Runix Backend", version="0.1.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    author: Literal["User", "AI"]
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    agent: Optional[Literal["crow", "falcon", "owl", "phoenix"]] = "crow"
    stream: Optional[bool] = False


def build_system_prompt(agent: str) -> str:
    base = (
        "You are Runix AI, a helpful research assistant for scientific discovery. "
        "Provide concise, accurate answers with citations and step-wise reasoning when appropriate."
    )
    if agent == "falcon":
        return base + " Focus on deep literature survey and meta-analysis across full texts."
    if agent == "owl":
        return base + " Perform novelty checks and prior-art sweeps: 'Has anyone done X?'."
    if agent == "phoenix":
        return base + " Act as a ChemCrow-style planner. Emphasize verification and uncertainty notes."
    return base


def to_openai_messages(payload: ChatRequest):
    openai_messages = [
        {"role": "system", "content": build_system_prompt(payload.agent or "crow")}
    ]
    for m in payload.messages:
        role = "user" if m.author == "User" else "assistant"
        openai_messages.append({"role": role, "content": m.content})
    return openai_messages


@app.post("/chat")
async def chat(req: Request):
    # Prefer bearer from Authorization header; fallback to env
    auth = req.headers.get("authorization") or ""
    bearer = auth.split(" ", 1)[1] if auth.lower().startswith("bearer ") and len(auth.split(" ", 1)) > 1 else None
    openai_key = bearer or DEFAULT_OPENAI_API_KEY
    if not openai_key:
        return JSONResponse({"error": "Missing OpenAI API key"}, status_code=401)

    body = await req.json()
    try:
        payload = ChatRequest(**body)
    except Exception:
        return JSONResponse({"error": "Invalid request"}, status_code=400)

    client = OpenAI(api_key=openai_key)

    if payload.stream:
        def gen():
            completion = client.chat.completions.create(
                model="gpt-5-mini",
                messages=to_openai_messages(payload),
                temperature=0.7,
                max_tokens=1000,
                stream=True,
            )
            # SSE: emit deltas; also buffer final for convenience
            yield "event: open\n\n"
            buffer = ""
            for chunk in completion:
                delta = chunk.choices[0].delta.content if chunk.choices and chunk.choices[0].delta else None
                if delta:
                    buffer += delta
                    import json as _json
                    yield "data: " + _json.dumps({"delta": delta}) + "\n\n"
            import json as _json
            final = {"done": True, "message": {"id": 0, "author": "AI", "content": buffer}}
            yield "data: " + _json.dumps(final) + "\n\n"

        return StreamingResponse(gen(), media_type="text/event-stream")

    # Non-stream path
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=to_openai_messages(payload),
        temperature=0.7,
        max_tokens=1000,
        stream=False,
    )
    content = completion.choices[0].message.content if completion.choices else ""
    return {"message": {"id": 0, "author": "AI", "content": content}}


def main():
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8787, reload=True)


