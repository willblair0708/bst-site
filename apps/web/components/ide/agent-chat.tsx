"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Paperclip, Send, Sparkles } from "lucide-react"

type Msg = { id: string; role: "user" | "assistant"; content: string }

export function AgentChat() {
  const [messages, setMessages] = React.useState<Msg[]>([{ id: "w1", role: "assistant", content: "Hi — I'm your research co‑pilot. Ask me to run analyses, draft writeups, or link evidence."}],)
  const [input, setInput] = React.useState("")
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [role, setRole] = React.useState<'Auto'|'Scholar'|'Analyst'|'Critic'>("Auto")
  const [attachments, setAttachments] = React.useState<string[]>([])
  const [sessions, setSessions] = React.useState<{ id: string; name: string }[]>([{ id: 's1', name: 'Default Session' }])
  const [activeSession, setActiveSession] = React.useState('s1')
  const suggestions = ["/summarize", "/search"]

  const renameSession = (id: string) => {
    const name = window.prompt('Rename session', sessions.find(s => s.id===id)?.name || '')?.trim()
    if (!name) return
    setSessions((ss) => ss.map((s) => s.id===id ? { ...s, name } : s))
  }

  const send = async () => {
    const text = input.trim()
    if (!text) return
    const user: Msg = { id: String(Date.now()), role: 'user', content: text }
    setMessages((m) => [...m, user])
    setInput("")
    listRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' })
    try {
      setLoading(true)
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agent: 'DIRECTOR', stream: false, messages: [{ role: 'user', content: text }] }) })
      const json = await res.json().catch(() => ({}))
      const content = json?.message?.content || json?.reply || 'OK'
      setMessages((m) => [...m, { id: String(Date.now()+1), role: 'assistant', content }])
      listRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' })
    } catch {}
    finally { setLoading(false) }
  }

  const onInsert = () => {
    window.dispatchEvent(new CustomEvent('ide:insert', { detail: { text: input || '// TODO' } }))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header (compact) */}
      <div className="px-3 py-2 flex items-center justify-between border-b bg-background/60">
        <div className="flex items-center gap-2">
          <div className="relative w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <div className="text-sm font-medium">Agent</div>
          <select
            className="ml-1 h-7 text-xs border rounded-lg px-2 bg-card"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            aria-label="Agent role"
          >
            {(['Auto','Scholar','Analyst','Critic'] as const).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="text-[10px] text-muted-foreground">Enter to send</div>
      </div>

      {/* Session control (compact) */}
      <div className="px-3 py-2 border-b bg-background/60">
        <div className="flex items-center gap-2">
          <select
            className="h-8 text-xs border rounded-lg px-2 bg-card"
            value={activeSession}
            onChange={(e) => setActiveSession(e.target.value)}
            aria-label="Session"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <Button size="sm" variant="secondary" className="rounded-xl"
            onClick={() => { const id = `s${Date.now()}`; setSessions((s) => [...s, { id, name: 'New Session' }]); setActiveSession(id) }}
          >New</Button>
          <Button size="sm" variant="ghost" className="rounded-xl"
            onClick={() => renameSession(activeSession)}
          >Rename</Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div ref={listRef} className="p-3 space-y-2">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm border ${m.role === 'user' ? 'ml-auto bg-primary-100/80 border-primary-100' : 'bg-card'} ${m.role === 'user' ? 'text-foreground' : 'text-foreground'}`}
            >
              <div className="whitespace-pre-wrap">
                {m.content}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                <button onClick={() => navigator.clipboard.writeText(m.content)}>Copy</button>
                <button onClick={() => setInput(`> ${m.content}`)}>Quote</button>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" /> Thinking…
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggestions (minimal) */}
      <div className="px-3 pb-2 pt-1 flex flex-wrap gap-2 items-center">
        {suggestions.map((s, i) => (
          <button key={i} className="px-2 py-0.5 rounded-full text-[11px] border hover:bg-muted/60" onClick={() => setInput(s)}>{s}</button>
        ))}
      </div>

      {/* Composer */}
      <div className="p-2 border-t flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-muted/60" aria-label="Attach" onClick={() => setAttachments((r) => [...r, `file-${r.length+1}.txt`])}><Paperclip className="w-4 h-4" /></button>
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' && !e.shiftKey) ? (e.preventDefault(), send()) : null} placeholder="Ask the agent…" className="rounded-xl" />
        <Button className="rounded-xl" variant="secondary" onClick={onInsert}>Insert</Button>
        <Button className="rounded-xl" onClick={send} disabled={loading}>
          <Send className="w-4 h-4 mr-1" /> Send
        </Button>
      </div>
    </div>
  )
}


