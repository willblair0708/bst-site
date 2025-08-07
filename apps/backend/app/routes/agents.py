from fastapi import APIRouter
from app.agents.roles import build_agents
from typing import Any

router = APIRouter()


@router.get("/v1/agents")
def list_agents():
    try:
        agents = build_agents()
        return {"agents": sorted(list(agents.keys()))}
    except Exception:
        # Fallback to canonical names if Agents SDK isn't installed
        return {"agents": ["SCOUT", "SCHOLAR", "ARCHIVIST", "ALCHEMIST", "ANALYST", "DIRECTOR"]}


@router.get("/v1/agents/aliases")
def list_aliases():
    from app.agents.roles import ALIASES  # lazy import to avoid cycles
    return {"aliases": ALIASES}


@router.get("/v1/mcp/tools")
async def list_mcp_tools(server: str):
    try:
        from app.mcp.manager import build_mcp_servers  # type: ignore
        servers = build_mcp_servers()
        # Use Agents SDK server object to list tools
        target = None
        for s in servers:
            if getattr(s, "name", "") == server:
                target = s
                break
        if target is None:
            return {"server": server, "error": "not configured"}
        await target.connect()
        tools_list = await target.list_tools()
        # Normalize
        tools = [getattr(t, "model_dump", lambda: {"name": getattr(t, "name", "unknown")})() for t in tools_list]
        await target.cleanup()
        return {"server": server, "tools": tools}
    except Exception as e:  # pragma: no cover
        return {"server": server, "error": str(e)}


