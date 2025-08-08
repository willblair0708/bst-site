"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

type Msg = { id: string; role: "user" | "assistant"; content: string }

export function AgentChat() {
  const [messages, setMessages] = React.useState<Msg[]>([{
    id: "w1", role: "assistant", content: "Hi — I'm your research co‑pilot. Ask me to run analyses, draft writeups, or link evidence."}],)
  const [input, setInput] = React.useState("")
  const listRef = React.useRef<HTMLDivElement | null>(null)

  const send = async () => {
    const text = input.trim()
    if (!text) return
    const user: Msg = { id: String(Date.now()), role: 'user', content: text }
    setMessages((m) => [...m, user])
    setInput("")
    listRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' })
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agent: 'DIRECTOR', stream: false, messages: [{ role: 'user', content: text }] }) })
      const json = await res.json().catch(() => ({}))
      const content = json?.message?.content || json?.reply || 'OK'
      setMessages((m) => [...m, { id: String(Date.now()+1), role: 'assistant', content }])
      listRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' })
    } catch {}
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-2 py-1 flex items-center justify-between border-b">
        <div className="text-sm font-medium">Agents</div>
        <div className="flex gap-1"><Badge variant="secondary">Auto</Badge><Badge variant="secondary">Scholar</Badge></div>
      </div>
      <ScrollArea className="flex-1">
        <div ref={listRef} className="p-2 space-y-2">
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl px-3 py-2 text-sm border ${m.role === 'user' ? 'bg-primary-100/70' : 'bg-card'}`}>
              {m.content}
            </motion.div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-2 border-t flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? send() : null} placeholder="Ask the agent…" className="rounded-xl" />
        <Button className="rounded-xl" onClick={send}>Send</Button>
      </div>
    </div>
  )
}


