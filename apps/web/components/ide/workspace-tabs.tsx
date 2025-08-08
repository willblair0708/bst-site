"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileExplorer } from "@/components/ide/file-explorer"
import { Search, GitBranch, Bot, Files, MoreHorizontal, X, Plus, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Sparkline from "@/components/ui/sparkline"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function WorkspaceTabs({ repoId, onOpenFile, selectedPath }: { repoId: string; onOpenFile: (p: string) => void; selectedPath?: string }) {
  const [tab, setTab] = React.useState("files")
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['1','2','3','4'].includes(e.key)) {
        e.preventDefault()
        setTab(['files','search','branch','agents'][parseInt(e.key)-1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const triggers = [
    { key: 'files', icon: Files, label: 'Files' },
    { key: 'search', icon: Search, label: 'Search' },
    { key: 'branch', icon: GitBranch, label: 'Branches' },
    { key: 'agents', icon: Bot, label: 'Agents' },
  ] as const

  return (
    <Tabs value={tab} onValueChange={setTab} className="h-full flex flex-col">
      <TabsList className="sticky top-0 z-10 relative grid grid-cols-4 rounded-xl m-2 mt-2 mb-2 h-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/40">
        <TooltipProvider>
          {triggers.map(({ key, icon: Icon, label }) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <TabsTrigger value={key} aria-label={label} className="relative p-0 rounded-xl data-[state=active]:text-foreground">
                  {tab === key && (
                    <motion.span layoutId="ws-active" className="absolute inset-0 rounded-xl bg-primary-100 border border-primary-100/70" transition={{ type: 'spring', stiffness: 350, damping: 25 }} />
                  )}
                  <motion.span className="relative inline-flex items-center justify-center w-10 h-10" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Icon className="w-4 h-4" />
                  </motion.span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TabsList>

      <AnimatePresence mode="wait">
        {tab === 'files' && (
          <TabsContent value="files" className="flex-1 overflow-hidden" forceMount>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <FileExplorer repoId={repoId} onOpen={onOpenFile} selectedPath={selectedPath} />
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tab === 'search' && (
          <TabsContent value="search" className="flex-1 overflow-hidden" forceMount>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <RepoSearch repoId={repoId} onOpenFile={onOpenFile} />
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tab === 'branch' && (
          <TabsContent value="branch" className="flex-1 overflow-hidden" forceMount>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <RepoBranches repoId={repoId} />
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tab === 'agents' && (
          <TabsContent value="agents" className="flex-1 overflow-hidden" forceMount>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="p-2">
              <AgentsPanel />
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>
    </Tabs>
  )
}

function RepoBranches({ repoId }: { repoId: string }) {
  const [branches, setBranches] = React.useState<string[]>([])
  const [current, setCurrent] = React.useState<string>("")
  React.useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/repo/branches?repo=${encodeURIComponent(repoId)}`)
      const json = await res.json()
      setBranches(json?.branches || [])
      setCurrent(json?.branches?.[0] || "main")
    }
    load()
  }, [repoId])
  return (
    <div className="p-2 text-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">Branches</div>
        {!!branches.length && (
          <div className="text-xs text-muted-foreground">{branches.length} total</div>
        )}
      </div>
      <div className="rounded-xl border p-2 bg-background/70">
        <div className="text-xs mb-1">Current</div>
        <div className="flex items-center justify-between">
          <div className="px-2 py-1 rounded-md bg-primary-100 text-foreground text-xs font-medium">{current}</div>
          <Sparkline data={[4,6,3,8,7,10,9]} width={60} height={18} />
        </div>
      </div>
      <ul className="space-y-1">
        {branches.map((b) => (
          <li key={b} className="px-2 py-1 rounded hover:bg-muted/50 cursor-pointer flex items-center justify-between">
            <span>{b}</span>
            {b === current && <span className="text-[10px] text-primary-600">active</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

function RepoSearch({ repoId, onOpenFile }: { repoId: string; onOpenFile: (p: string) => void }) {
  const [q, setQ] = React.useState("")
  const [results, setResults] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [debounceId, setDebounceId] = React.useState<any>(null)
  const [type, setType] = React.useState<'all'|'code'|'docs'|'data'>('all')
  const [when, setWhen] = React.useState<'any'|'week'|'month'|'year'>('any')
  const search = React.useCallback(async (val: string) => {
    if (!val) { setResults([]); return }
    setLoading(true)
    const res = await fetch(`/api/repo/search?repo=${encodeURIComponent(repoId)}&q=${encodeURIComponent(val)}&type=${type}&when=${when}`)
    const json = await res.json().catch(() => ({}))
    setResults(json?.results || [])
    setLoading(false)
  }, [repoId, type, when])
  const highlight = (text: string) => {
    if (!q.trim()) return text
    const i = text.toLowerCase().indexOf(q.toLowerCase())
    if (i === -1) return text
    return <span>{text.slice(0,i)}<mark className="bg-primary-200/60 rounded px-0.5">{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</span>
  }
  return (
    <div className="p-2 space-y-2 h-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={q}
            onChange={(e) => {
              const val = e.target.value
              setQ(val)
              if (debounceId) clearTimeout(debounceId)
              setDebounceId(setTimeout(() => search(val), 180))
            }}
            placeholder="Search in repo…"
            className="rounded-xl pl-3 pr-10"
          />
          {loading && <motion.span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />}
        </div>
        <select className="h-9 text-xs border rounded-lg px-2 bg-card" value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="all">All</option>
          <option value="code">Code</option>
          <option value="docs">Docs</option>
          <option value="data">Data</option>
        </select>
        <select className="h-9 text-xs border rounded-lg px-2 bg-card" value={when} onChange={(e) => setWhen(e.target.value as any)}>
          <option value="any">Any time</option>
          <option value="week">Last week</option>
          <option value="month">Last month</option>
          <option value="year">Last year</option>
        </select>
        <button className="h-9 text-xs border rounded-lg px-2 bg-card" onClick={() => { setQ(''); setResults([]) }}>Clear</button>
      </div>
      <ScrollArea className="h-[calc(100%-48px)]">
        <div className="space-y-1">
          {results.map((r, idx) => (
            <button
              key={idx}
              className="w-full text-left px-2 py-2 rounded-xl border border-transparent hover:bg-muted/40 hover:border-border/80 transition-colors"
              onClick={(e) => onOpenFile(r.path)}
              onKeyDown={(e) => { if (e.altKey && e.key === 'Enter') onOpenFile(r.path) }}
            >
              <div className="text-[13px] font-medium truncate">{highlight(r.path)}</div>
              {r.preview && <div className="text-xs text-muted-foreground line-clamp-2">{highlight(r.preview)}</div>}
            </button>
          ))}
          {!results.length && !q && <div className="text-xs text-muted-foreground p-2">Type to search files</div>}
          {!results.length && !!q && !loading && <div className="text-xs text-muted-foreground p-2">No results</div>}
        </div>
      </ScrollArea>
    </div>
  )
}

function ESM2Widget() {
  const [sequence, setSequence] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [meanEmbedding, setMeanEmbedding] = React.useState<number[] | null>(null)

  const run = async () => {
    setLoading(true)
    setError(null)
    setMeanEmbedding(null)
    try {
      const res = await fetch('/api/models/esm2/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sequence }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.detail || 'Failed to compute embeddings')
      setMeanEmbedding(json?.mean_embedding || json?.meanEmbedding || [])
    } catch (e: any) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Textarea rows={4} value={sequence} onChange={(e) => setSequence(e.target.value)} placeholder="Paste protein sequence (FASTA letters)…" className="rounded-xl" />
      <div className="flex items-center justify-between">
        <Button size="sm" className="rounded-xl" onClick={run} disabled={loading || !sequence.trim()}>
          {loading ? 'Computing…' : 'Compute'}
        </Button>
        {meanEmbedding && meanEmbedding.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-muted-foreground">dim {meanEmbedding.length}</div>
            <Sparkline data={meanEmbedding.slice(0, 40)} width={80} height={20} />
          </div>
        )}
      </div>
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  )
}

function AgentsPanel() {
  const items = [
    { title: 'Designing a …', when: 'Now', gain: +1520, cost: -105 },
    { title: 'Enhance dashboard', when: '1m', gain: 0, cost: 0 },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input placeholder="Search Agents (⌘K)" className="rounded-xl" />
        </div>
        <Button variant="secondary" className="rounded-xl">
          <Plus className="w-4 h-4 mr-1" /> New Agent
        </Button>
      </div>

      <div className="text-xs text-muted-foreground px-1">On This Computer {items.length}</div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border bg-background/70 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div className="truncate text-sm font-medium">{it.title}</div>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-emerald-500 font-mono">{it.gain ? `+${it.gain}` : ''}</span>
              <span className="text-rose-500 font-mono">{it.cost ? `${it.cost}` : ''}</span>
              <span className="text-muted-foreground">{it.when}</span>
              <button className="p-1 rounded-md hover:bg-muted/60" aria-label="More"><MoreHorizontal className="w-4 h-4" /></button>
              <button className="p-1 rounded-md hover:bg-muted/60" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-1 pt-1 text-xs text-muted-foreground">
        <div>In Background 0</div>
        <button className="p-1 rounded-md hover:bg-muted/60" aria-label="Add background"><Plus className="w-4 h-4" /></button>
      </div>

      <div className="px-1 text-xs text-muted-foreground">Archive 1</div>
    </div>
  )
}


