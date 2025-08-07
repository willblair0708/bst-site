"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Play, Bot, ActivitySquare, Clock, DollarSign, Network, AlertTriangle, CheckCircle2 } from "lucide-react"

type AgentRole = "SCOUT" | "SCHOLAR" | "ANALYST" | "CRITIC" | "EDITOR"

interface TimelineEvent {
  id: string
  role: AgentRole
  summary: string
  detail?: string
  costUsd?: number
  latencyMs?: number
  tool?: string
  status?: "running" | "success" | "error"
}

export function AgentConsole() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [query, setQuery] = useState("")
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [events])

  const run = useCallback(async () => {
    if (!query.trim()) return
    setBusy(true)
    const id = crypto.randomUUID()
    const start = Date.now()
    setEvents((e) => [
      ...e,
      { id, role: "SCOUT", summary: `Finding sources for: ${query}`, status: "running" }
    ])
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stream: false, agent: "DIRECTOR", messages: [{ role: "user", content: query }] })
      })
      const data = await res.json()
      const latency = Date.now() - start
      setEvents((e) => e.map(ev => ev.id === id ? {
        ...ev,
        status: "success",
        detail: typeof data === "string" ? data : JSON.stringify(data).slice(0, 400) + "…",
        tool: "DIRECTOR",
        latencyMs: latency,
        costUsd: 0.01,
      } : ev))
    } catch (err: any) {
      setEvents((e) => e.map(ev => ev.id === id ? { ...ev, status: "error", detail: String(err) } : ev))
    } finally {
      setBusy(false)
    }
  }, [query])

  const StatusIcon = ({ status }: { status?: TimelineEvent["status"] }) => {
    if (status === "success") return <CheckCircle2 className="w-3 h-3 text-accent" />
    if (status === "error") return <AlertTriangle className="w-3 h-3 text-destructive" />
    return <ActivitySquare className="w-3 h-3 text-primary animate-pulse" />
  }

  return (
    <div className="flex flex-col h-40">
      <div className="flex items-center gap-2 p-2 border-b bg-background/80 rounded-t-2xl">
        <Badge variant="purple" className="rounded-xl">Agent Console</Badge>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="rounded-xl"><Clock className="w-3 h-3 mr-1" />p95 &lt; 6s</Badge>
          <Badge variant="outline" className="rounded-xl"><DollarSign className="w-3 h-3 mr-1" />$0.01/run</Badge>
          <Badge variant="outline" className="rounded-xl"><Network className="w-3 h-3 mr-1" />MCP</Badge>
        </div>
      </div>
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-3 space-y-2">
          {events.map((e) => (
            <div key={e.id} className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-2 text-sm">
                <StatusIcon status={e.status} />
                <span className="font-medium">{e.role}</span>
                <span className="text-muted-foreground">— {e.summary}</span>
                {e.tool && <Badge variant="outline" className="ml-auto rounded-xl">{e.tool}</Badge>}
              </div>
              {e.detail && (
                <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap font-mono">{e.detail}</pre>
              )}
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                {e.latencyMs != null && (<span><Clock className="inline w-3 h-3 mr-1" />{e.latencyMs} ms</span>)}
                {e.costUsd != null && (<span><DollarSign className="inline w-3 h-3 mr-1" />{e.costUsd.toFixed(3)}</span>)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-2 border-t flex items-center gap-2 rounded-b-2xl">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask, e.g., Summarize EGFR resistance mechanisms with citations"
          className="rounded-xl"
          onKeyDown={(e) => { if (e.key === 'Enter') run() }}
        />
        <Button onClick={run} disabled={busy} className="rounded-xl">
          <Bot className="w-4 h-4 mr-2" />
          {busy ? "Running…" : "Ask Agents"}
        </Button>
      </div>
    </div>
  )
}


