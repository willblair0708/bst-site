from fastapi import APIRouter
from app.agents.roles import build_agents

router = APIRouter()


@router.get("/v1/agents")
def list_agents():
    try:
        agents = build_agents()
        return {"agents": sorted(list(agents.keys()))}
    except Exception:
        # Fallback to canonical names if Agents SDK isn't installed
        return {"agents": ["SCOUT", "SCHOLAR", "ARCHIVIST", "ALCHEMIST", "ANALYST"]}


@router.get("/v1/agents/aliases")
def list_aliases():
    from app.agents.roles import ALIASES  # lazy import to avoid cycles
    return {"aliases": ALIASES}


