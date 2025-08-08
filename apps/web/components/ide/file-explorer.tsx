"use client"

import React, { useEffect, useState } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, RefreshCcw, FilePlus, FolderPlus } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

type Node = { name: string; path: string; type: 'file' | 'dir'; children?: Node[] }

export function FileExplorer({ repoId, onOpen, selectedPath, refreshKey }: { repoId: string; onOpen: (p: string) => void; selectedPath?: string; refreshKey?: number }) {
  const [tree, setTree] = useState<Node[]>([])
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [filter, setFilter] = useState("")
  const [recent, setRecent] = useState<string[]>([])

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/repo/tree?repo=${encodeURIComponent(repoId)}`)
      const json = await res.json()
      if (json?.tree) setTree(json.tree)
    } finally {
      setLoading(false)
    }
  }, [repoId])

  useEffect(() => {
    if (repoId) load()
  }, [repoId, refreshKey, load])

  const collapseAll = () => setOpen({})

  const create = async (type: 'file' | 'dir') => {
    const name = window.prompt(`New ${type === 'file' ? 'file' : 'folder'} name`)?.trim()
    if (!name) return
    try {
      await fetch('/api/repo/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repoId, command: type === 'file' ? `touch ${name}` : `mkdir ${name}` })
      })
      await load()
    } catch {}
  }

  const toggle = (p: string) => setOpen((s) => ({ ...s, [p]: !s[p] }))

  const render = (nodes: Node[], depth = 0) => (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li key={n.path}>
          {n.type === 'dir' ? (
            <motion.div
              layout
              whileHover={{ x: 2 }}
              className="flex items-center gap-1 cursor-pointer select-none px-2 py-1 rounded hover:bg-muted/50"
              onClick={() => toggle(n.path)}
              style={{ paddingLeft: depth * 10 }}
            >
              {open[n.path] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {open[n.path] ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
              <span className="text-sm">{n.name}</span>
            </motion.div>
          ) : (
            <motion.button
              layout
              whileHover={{ x: 2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              aria-selected={selectedPath === n.path}
              className={`relative flex items-center gap-2 w-full text-left px-2 py-1 rounded border ${selectedPath === n.path ? 'bg-primary-100/90 border-primary-100 shadow-soft' : 'border-transparent hover:bg-muted/50'}`}
              onClick={() => { onOpen(n.path); setRecent((r) => [n.path, ...r.filter((p) => p !== n.path)].slice(0, 5)) }}
              data-file-item="true"
              style={{ paddingLeft: depth * 10 }}
            >
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r ${selectedPath === n.path ? 'bg-primary-500' : 'bg-transparent'}`} />
              <FileText className={`w-3.5 h-3.5 ${selectedPath === n.path ? 'text-primary-600' : ''}`} />
              <span className={`text-sm truncate ${selectedPath === n.path ? 'text-foreground' : ''}`}>{n.name}</span>
              <span className="ml-auto text-[10px] text-muted-foreground font-mono">{n.name.split('.').pop()?.toUpperCase()}</span>
            </motion.button>
          )}
          {n.children && open[n.path] && (
            <div className="pl-4">{render(n.children, depth + 1)}</div>
          )}
        </li>
      ))}
    </ul>
  )

  // Basic keyboard navigation across visible file buttons
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const root = containerRef.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLButtonElement>('button[data-file-item="true"]'))
    const index = items.findIndex((el) => el === document.activeElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = items[Math.min(index + 1, items.length - 1)] || items[0]
      next?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = items[Math.max(index - 1, 0)] || items[items.length - 1]
      prev?.focus()
    } else if (e.key === 'Enter' && (document.activeElement as HTMLButtonElement)?.dataset?.fileItem === 'true') {
      ;(document.activeElement as HTMLButtonElement)?.click()
    }
  }

  const filterTree = (nodes: Node[]): Node[] => {
    if (!filter.trim()) return nodes
    const q = filter.toLowerCase()
    const walk = (list: Node[]): Node[] =>
      list
        .map((n) => ({
          ...n,
          children: n.children ? walk(n.children) : undefined,
        }))
        .filter((n) => n.name.toLowerCase().includes(q) || (n.children && n.children.length))
    return walk(nodes)
  }

  return (
    <div ref={containerRef} className="h-full overflow-auto outline-none" tabIndex={0} onKeyDown={onKeyDown}>
      {/* Open editors */}
      {!!recent.length && (
        <div className="px-2 pt-2 pb-1">
          <div className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground mb-1">Open editors</div>
          <div className="space-y-1">
            {recent.map((p) => (
              <button key={p} className={`w-full text-left px-2 py-1 rounded hover:bg-muted/50 truncate ${selectedPath === p ? 'bg-muted/40' : ''}`} onClick={() => onOpen(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 bg-card/90 backdrop-blur px-2 pt-2 pb-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground truncate">{repoId}</div>
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip><TooltipTrigger asChild><button className="p-1.5 rounded-md hover:bg-muted/60" onClick={() => create('file')} aria-label="New file"><FilePlus className="w-4 h-4" /></button></TooltipTrigger><TooltipContent side="bottom">New file</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button className="p-1.5 rounded-md hover:bg-muted/60" onClick={() => create('dir')} aria-label="New folder"><FolderPlus className="w-4 h-4" /></button></TooltipTrigger><TooltipContent side="bottom">New folder</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button className="p-1.5 rounded-md hover:bg-muted/60" onClick={load} aria-label="Refresh"><RefreshCcw className="w-4 h-4" /></button></TooltipTrigger><TooltipContent side="bottom">Refresh</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button className="p-1.5 rounded-md hover:bg-muted/60" onClick={collapseAll} aria-label="Collapse all">▾</button></TooltipTrigger><TooltipContent side="bottom">Collapse all</TooltipContent></Tooltip>
            </div>
          </TooltipProvider>
        </div>
        <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter files…" className="h-8 rounded-lg" />
      </div>

      <div className="px-2 py-2">
        {loading ? (
          <div className="text-xs text-muted-foreground p-2">Loading…</div>
        ) : (
          render(filterTree(tree))
        )}
      </div>
    </div>
  )
}


