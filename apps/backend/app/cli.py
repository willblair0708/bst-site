import argparse
import json
import sys
from typing import Dict, Optional

import httpx


def _build_headers(api_key: Optional[str]) -> Dict[str, str]:
    headers: Dict[str, str] = {"content-type": "application/json"}
    if api_key:
        headers["authorization"] = f"Bearer {api_key}"
    return headers


def cmd_list_agents(base_url: str, api_key: Optional[str]) -> int:
    with httpx.Client(timeout=20) as client:
        resp = client.get(f"{base_url}/v1/agents", headers=_build_headers(api_key))
        resp.raise_for_status()
        data = resp.json()
        agents = data.get("agents", [])
        print("Agents:")
        for name in agents:
            print(f"- {name}")
    return 0


def _print_streaming_response(resp: httpx.Response) -> None:
    buffer: str = ""
    for line in resp.iter_lines():
        if not line:
            continue
        try:
            text = line.decode("utf-8") if isinstance(line, (bytes, bytearray)) else str(line)
        except Exception:
            continue
        if text.startswith("data: "):
            payload = text[len("data: "):]
            try:
                obj = json.loads(payload)
            except Exception:
                continue
            # stream deltas
            if "delta" in obj:
                delta = obj["delta"]
                buffer += delta
                sys.stdout.write(delta)
                sys.stdout.flush()
            # final
            if obj.get("done"):
                print()
                return


def cmd_create_task(base_url: str, api_key: Optional[str], agent: str, query: str, stream: bool) -> int:
    body = {"agent": agent, "query": query, "stream": stream}
    with httpx.Client(timeout=None) as client:
        if stream:
            with client.stream("POST", f"{base_url}/v1/tasks", headers=_build_headers(api_key), json=body) as resp:
                if resp.status_code >= 400:
                    print(f"Error {resp.status_code}: {resp.text}")
                    return 1
                print(f"[streaming] {agent}: {query}\n")
                _print_streaming_response(resp)
                return 0
        else:
            resp = client.post(f"{base_url}/v1/tasks", headers=_build_headers(api_key), json=body)
            if resp.status_code >= 400:
                print(f"Error {resp.status_code}: {resp.text}")
                return 1
            data = resp.json()
            task_id = data.get("task_id")
            print(json.dumps(data, indent=2))
            print(f"\nTask ID: {task_id}")
    return 0


def cmd_get_task(base_url: str, api_key: Optional[str], task_id: str) -> int:
    with httpx.Client(timeout=20) as client:
        resp = client.get(f"{base_url}/v1/tasks/{task_id}", headers=_build_headers(api_key))
        if resp.status_code >= 400:
            print(f"Error {resp.status_code}: {resp.text}")
            return 1
        print(json.dumps(resp.json(), indent=2))
    return 0


def cmd_continue_task(base_url: str, api_key: Optional[str], task_id: str, message: str, stream: bool) -> int:
    body = {"message": message, "stream": stream}
    with httpx.Client(timeout=None) as client:
        if stream:
            with client.stream("POST", f"{base_url}/v1/tasks/{task_id}/continue", headers=_build_headers(api_key), json=body) as resp:
                if resp.status_code >= 400:
                    print(f"Error {resp.status_code}: {resp.text}")
                    return 1
                print(f"[streaming] continue {task_id}: {message}\n")
                _print_streaming_response(resp)
                return 0
        else:
            resp = client.post(f"{base_url}/v1/tasks/{task_id}/continue", headers=_build_headers(api_key), json=body)
            if resp.status_code >= 400:
                print(f"Error {resp.status_code}: {resp.text}")
                return 1
            print(json.dumps(resp.json(), indent=2))
    return 0


def main() -> int:
    parent = argparse.ArgumentParser(add_help=False)
    parent.add_argument("--base-url", default="http://localhost:8787", help="Backend base URL")
    parent.add_argument("--api-key", default=None, help="Bearer token for backend (optional)")

    parser = argparse.ArgumentParser(prog="runix-agents", description="CLI to test backend agents")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("list", parents=[parent], help="List available agents")

    s_task = sub.add_parser("task", parents=[parent], help="Create a new task")
    s_task.add_argument("agent", help="Agent name, e.g. SCOUT/SCHOLAR/ARCHIVIST/ALCHEMIST/ANALYST")
    s_task.add_argument("query", help="User query text")
    s_task.add_argument("--stream", action="store_true", help="Stream the response")

    s_get = sub.add_parser("get", parents=[parent], help="Get a task by id")
    s_get.add_argument("task_id", help="Task id")

    s_cont = sub.add_parser("continue", parents=[parent], help="Continue a task with a new user message")
    s_cont.add_argument("task_id", help="Task id")
    s_cont.add_argument("message", help="Message to append")
    s_cont.add_argument("--stream", action="store_true", help="Stream the response")

    # Accept global flags before or after the subcommand
    try:
        args = parser.parse_intermixed_args()  # type: ignore[attr-defined]
    except Exception:
        args = parser.parse_args()

    base_url: str = args.base_url.rstrip("/")
    api_key: Optional[str] = args.api_key

    if args.cmd == "list":
        return cmd_list_agents(base_url, api_key)
    if args.cmd == "task":
        return cmd_create_task(base_url, api_key, args.agent, args.query, args.stream)
    if args.cmd == "get":
        return cmd_get_task(base_url, api_key, args.task_id)
    if args.cmd == "continue":
        return cmd_continue_task(base_url, api_key, args.task_id, args.message, args.stream)

    parser.print_help()
    return 2


if __name__ == "__main__":
    sys.exit(main())


