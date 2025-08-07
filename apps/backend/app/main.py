import os
from typing import List, Literal, Optional

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import logging
import json as _json

# Local imports
try:
    from app.routes.tasks import router as tasks_router
    from app.routes.agents import router as agents_router
    from app.services.rag import router as rag_router
    from app.services.chem import router as chem_router
    from app.services.docs import router as docs_router
except Exception:  # pragma: no cover - allow running as module
    from .routes.tasks import router as tasks_router  # type: ignore
    from .routes.agents import router as agents_router  # type: ignore
    from .services.rag import router as rag_router  # type: ignore
    from .services.chem import router as chem_router  # type: ignore
    from .services.docs import router as docs_router  # type: ignore

# Load environment variables from multiple potential .env locations
load_dotenv()  # current working directory
_here = os.path.dirname(__file__)
_app_env = os.path.abspath(os.path.join(_here, ".env"))
_backend_env = os.path.abspath(os.path.join(_here, "..", ".env"))
for _p in (_app_env, _backend_env):
    if os.path.exists(_p):
        load_dotenv(_p, override=False)

DEFAULT_OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

app = FastAPI(title="Runix Backend", version="0.1.0")
# JSON logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("runix")


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
    goal: Optional[str] = None
    mode: Optional[Literal["qa", "review", "novelty", "planner"]] = None
    output: Optional[Literal["bullets", "memo", "plan", "json"]] = None
    temperature: Optional[float] = None
    max_output_tokens: Optional[int] = None


def build_system_prompt(agent: str, goal: Optional[str] = None, mode: Optional[str] = None, output: Optional[str] = None) -> str:
    base = (
        "You are Runix AI, a helpful research assistant for scientific discovery. "
        "Prefer verifiable claims with citations and high-level reasoning summaries (no hidden steps). "
        "Always be precise and note uncertainties."
    )
    if agent == "falcon":
        base += " Focus on deep literature survey and meta-analysis across full texts."
    if agent == "owl":
        base += " Perform novelty checks and prior-art sweeps: 'Has anyone done X?'."
    if agent == "phoenix":
        base += " Act as a ChemCrow-style planner. Emphasize verification and uncertainty notes."

    if mode == "review":
        base += " Structure as: Scope, Key Findings, Methods Notes, Gaps, References."
    elif mode == "novelty":
        base += " Structure as: Query framing, Known Work, Potential Gaps, Confidence, References."
    elif mode == "planner":
        base += " Structure as: Objective, Approach, Steps, Reagents/Tools, Risks, Alternatives."

    if output == "bullets":
        base += " Use compact bullet lists."
    elif output == "memo":
        base += " Write a concise research memo."
    elif output == "plan":
        base += " Present a stepwise plan with materials."
    elif output == "json":
        base += " Return JSON with fields: summary, steps[], citations[]."

    if goal:
        base += f" Current goal: {goal.strip()[:500]}"

    return base


def to_transcript(payload: ChatRequest) -> str:
    # Convert structured messages to a plain transcript for Responses API input
    lines: list[str] = []
    for m in payload.messages:
        role = "User" if m.author == "User" else "Assistant"
        lines.append(f"{role}: {m.content}")
    lines.append("Assistant:")
    return "\n".join(lines)


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
            system = build_system_prompt(payload.agent or "crow", payload.goal, payload.mode, payload.output)
            yield "event: open\n\n"
            buffer = ""
            with client.responses.stream(
                model="gpt-4o-mini",
                instructions=system,
                input=to_transcript(payload),
                temperature=payload.temperature if payload.temperature is not None else 0.7,
                max_output_tokens=payload.max_output_tokens if payload.max_output_tokens is not None else 1000,
            ) as stream:
                for event in stream:
                    # Text deltas
                    et = getattr(event, "type", "")
                    if et == "response.output_text.delta":
                        delta = getattr(event, "delta", "") or ""
                        if delta:
                            buffer += delta
                            yield "data: " + _json.dumps({"delta": delta}) + "\n\n"
                    # Log non-text events briefly
                    if et and et != "response.output_text.delta":
                        logger.info(_json.dumps({"event": et}))
                    # You may also inspect other event types if needed
                # Final assembled response
                final_resp = stream.get_final_response()
                content_text = getattr(final_resp, "output_text", None) or buffer
                final = {"done": True, "message": {"id": 0, "author": "AI", "content": content_text}}
                yield "data: " + _json.dumps(final) + "\n\n"

        return StreamingResponse(gen(), media_type="text/event-stream")

    # Non-stream path
    resp = client.responses.create(
        model="gpt-4o-mini",
        instructions=build_system_prompt(payload.agent or "crow", payload.goal, payload.mode, payload.output),
        input=to_transcript(payload),
        temperature=payload.temperature if payload.temperature is not None else 0.7,
        max_output_tokens=payload.max_output_tokens if payload.max_output_tokens is not None else 1000,
    )
    content = getattr(resp, "output_text", None)
    if not content:
        # Fallback: try to extract first text block
        try:
            content = resp.output[0].content[0].text["value"]  # type: ignore
        except Exception:
            content = ""
    return {"message": {"id": 0, "author": "AI", "content": content}}


# Healthcheck
@app.get("/health")
async def health():
    return {"ok": True}


# Routers for Phase 0 services and tasks API
app.include_router(tasks_router, prefix="")
app.include_router(agents_router, prefix="")
app.include_router(rag_router, prefix="/services")
app.include_router(chem_router, prefix="/services")
app.include_router(docs_router, prefix="/services")


# Serve OpenAPI action specs statically
infra_actions_dir = os.path.join(os.path.dirname(__file__), "infra", "actions")
if os.path.isdir(os.path.abspath(infra_actions_dir)):
    app.mount(
        "/infra/actions",
        StaticFiles(directory=os.path.abspath(infra_actions_dir)),
        name="infra-actions",
    )


def main():
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8787, reload=True)


