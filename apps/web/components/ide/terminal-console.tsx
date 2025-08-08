"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"

type Line = { text: string; kind?: "out" | "err" | "cmd" }

export function TerminalConsole({ repoId = 'demo' }: { repoId?: string }) {
  const [lines, setLines] = useState<Line[]>([
    { text: "Runix Terminal — type 'help' for commands", kind: "out" },
  ])
  const [input, setInput] = useState("")
  const viewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    viewRef.current?.scrollTo({ top: viewRef.current.scrollHeight })
  }, [lines])

  const append = (l: Line | string, kind: Line["kind"] = "out") =>
    setLines((prev) => [...prev, typeof l === "string" ? { text: l, kind } : l])

  const helpText = [
    "help — show commands",
    "echo <text> — print",
    "review <topic> — agentic referenced review",
    "bundle save — persist current protocol",
    "ls | cat <file> | head <file> | tail <file> | wc <file> — repo shell",
  ]

  const handle = useCallback(async () => {
    const cmd = input.trim()
    if (!cmd) return
    append({ text: `> ${cmd}`, kind: "cmd" })
    setInput("")
    const [name, ...rest] = cmd.split(" ")

    try {
      if (name === "help") {
        helpText.forEach((t) => append(t))
        return
      }
      if (name === "echo") {
        append(rest.join(" "))
        return
      }
      if (["ls","cat","head","tail","wc","pwd"].includes(name)) {
        const res = await fetch('/api/repo/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: repoId, cmd }) })
        const json = await res.json()
        if (json.stdout) append(json.stdout)
        if (json.stderr) append(json.stderr, 'err')
        return
      }
      if (name === "review") {
        const topic = rest.join(" ") || "EGFR resistance mechanisms"
        append(`agent: DIRECTOR → referenced review: ${topic}`)
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stream: false, agent: "DIRECTOR", messages: [{ role: "user", content: `Write a referenced review on ${topic}. Cite sources and include uncertainty notes.` }] })
        })
        const data = await res.json().catch(() => ({ error: "bad response" }))
        append(typeof data === "string" ? data : JSON.stringify(data, null, 2))
        return
      }
      if (name === "bundle" && rest[0] === "save") {
        append("Saving protocol to repo…")
        const res = await fetch("/api/protocol", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: "id: CTP-ABC123\nversion: v1\n" }) })
        const json = await res.json()
        append(JSON.stringify(json))
        return
      }
      append(`Unknown command: ${name}`, "err")
    } catch (e: any) {
      append(String(e), "err")
    }
  }, [input])

  return (
    <div className="flex flex-col h-32 bg-neutral-100/60">
      <div ref={viewRef} className="flex-1 overflow-auto font-mono text-[12px] p-2">
        {lines.map((l, i) => (
          <div key={i} className={l.kind === "err" ? "text-destructive-500" : l.kind === "cmd" ? "text-foreground" : "text-muted-foreground"}>{l.text}</div>
        ))}
      </div>
      <div className="border-t px-2 py-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handle() }}
          placeholder="help | review EGFR resistance | bundle save"
          className="w-full bg-transparent outline-none font-mono text-[12px]"
        />
      </div>
    </div>
  )
}


