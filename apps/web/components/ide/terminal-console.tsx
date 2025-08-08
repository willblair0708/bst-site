"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"

type Line = { text: string; kind?: "out" | "err" | "cmd" }

export function TerminalConsole({ repoId = 'demo' }: { repoId?: string }) {
  const [lines, setLines] = useState<Line[]>([
    { text: "Runix Terminal — type 'help' for commands", kind: "out" },
  ])
  const [input, setInput] = useState("")
  const viewRef = useRef<HTMLDivElement>(null)
  const [cwd, setCwd] = useState<string>(".")
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number>(-1)

  useEffect(() => {
    viewRef.current?.scrollTo({ top: viewRef.current.scrollHeight })
  }, [lines])

  const append = (l: Line | string, kind: Line["kind"] = "out") =>
    setLines((prev) => [...prev, typeof l === "string" ? { text: l, kind } : l])

  const ansiToHtml = (text: string) => {
    // very small subset of ANSI color codes
    return text.replace(/\u001b\[(\d+?)m/g, (_m, code) => {
      const c = Number(code)
      const map: Record<number, string> = {
        31: 'text-red-600', 32: 'text-green-600', 33: 'text-amber-600', 34: 'text-blue-600', 35: 'text-fuchsia-600', 36: 'text-cyan-600', 0: ''
      }
      return `</span><span class=\"${map[c]||''}\">`
    })
  }

  const helpText = [
    "help — show commands",
    "echo <text> — print",
    "review <topic> — agentic referenced review",
    "bundle save — persist current protocol",
    "ls | cat <file> | head <file> | tail <file> | wc <file> | mkdir <dir> | touch <file> — repo shell",
    "clear — clear screen",
    "cd <dir> — change directory (within repo)",
    "Ctrl+L — clear, ↑/↓ — history",
  ]

  const handle = useCallback(async () => {
    const cmd = input.trim()
    if (!cmd) return
    append({ text: `> ${cmd}`, kind: "cmd" })
    setHistory((h) => [cmd, ...h])
    setHistIdx(-1)
    setInput("")
    const [name, ...rest] = cmd.split(" ")

    try {
      if (name === "help") {
        helpText.forEach((t) => append(t))
        return
      }
      if (name === "clear") {
        setLines([])
        return
      }
      if (name === "echo") {
        append(rest.join(" "))
        return
      }
      if (name === "cd") {
        const target = rest[0] || "."
        // deny absolute/parent
        if (target.startsWith('/') || target.includes('..')) {
          append('Invalid path', 'err'); return
        }
        // test by running 'pwd' in that cwd
        const test = await fetch('/api/repo/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: repoId, cmd: 'pwd', cwd: target }) })
        if (test.ok) {
          setCwd(target)
          append(`cwd: ${target}`)
        } else {
          append('Directory not accessible', 'err')
        }
        return
      }
      if (["ls","cat","head","tail","wc","pwd","mkdir","touch"].includes(name)) {
        const res = await fetch('/api/repo/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: repoId, cmd, cwd }) })
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
  }, [input, cwd, repoId])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { handle() }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault(); setLines([])
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistIdx((idx) => {
        const next = Math.min(idx + 1, history.length - 1)
        setInput(history[next] || input)
        return next
      })
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistIdx((idx) => {
        const next = Math.max(idx - 1, -1)
        setInput(next === -1 ? "" : (history[next] || ""))
        return next
      })
    }
  }

  const isHash = (s: string) => /\b[0-9a-f]{6,40}\b/.test(s)
  const isPath = (s: string) => /\b([\w\-\.\/]+\.[\w\-]+|\/[\w\-\.\/]+)\b/.test(s)
  const renderLine = (text: string) => {
    const html = ansiToHtml(text).replace(/\b([0-9a-f]{6,40})\b/g, '<span data-kind="hash" class="underline cursor-pointer">$1<\/span>')
      .replace(/(\w[\w\-\.\/]+\.[\w\-]+)/g, '<span data-kind="path" class="underline cursor-pointer">$1<\/span>')
    return html
  }

  useEffect(() => {
    const el = viewRef.current
    if (!el) return
    const onClick = (e: any) => {
      const t = e.target as HTMLElement
      if (t?.dataset?.kind === 'hash' || t?.dataset?.kind === 'path') {
        navigator.clipboard.writeText(t.textContent || '')
      }
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="flex flex-col h-full min-h-0 bg-neutral-100/60">
      <div ref={viewRef} className="flex-1 min-h-0 overflow-auto font-mono text-[12px] p-2 select-text">
        {lines.map((l, i) => (
          <div key={i} className={l.kind === "err" ? "text-destructive-500" : l.kind === "cmd" ? "text-foreground" : "text-muted-foreground"} dangerouslySetInnerHTML={{ __html: l.kind === 'out' ? renderLine(l.text) : l.text }} />
        ))}
      </div>
      <div className="border-t px-2 py-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`(${cwd}) help | ls | cd data | python3 run_demo.py`}
          className="w-full bg-transparent outline-none font-mono text-[12px]"
        />
      </div>
    </div>
  )
}


