"use client"

import React, { useEffect, useState } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, RefreshCcw, FilePlus, FolderPlus, ExternalLink, Trash2, Copy, Pencil, CornerDownRight, Download, Star } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

type Node = { name: string; path: string; type: 'file' | 'dir'; children?: Node[] }

export function FileExplorer({ repoId, onOpen, selectedPath, refreshKey, openEditors, onSelectOpenEditor, onCloseOpenEditor }:
  { repoId: string; onOpen: (p: string) => void; selectedPath?: string; refreshKey?: number; openEditors?: string[]; onSelectOpenEditor?: (p: string) => void; onCloseOpenEditor?: (p: string) => void }) {
  const [tree, setTree] = useState<Node[]>([])
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [filter, setFilter] = useState("")
  const [recent, setRecent] = useState<string[]>([])
  const [menu, setMenu] = useState<{ x: number; y: number; path: string; type: 'file' | 'dir' } | null>(null)
  const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set())
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(`ide:${repoId}:pins`)||'[]') } catch { return [] }
  })
  useEffect(() => { try { localStorage.setItem(`ide:${repoId}:pins`, JSON.stringify(pinned)) } catch {} }, [repoId, pinned])

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
        body: JSON.stringify({ repo: repoId, cmd: type === 'file' ? `touch ${name}` : `mkdir ${name}` })
      })
      await load()
    } catch {}
  }

  const removePath = async (p: string) => {
    if (!window.confirm(`Delete ${p}?`)) return
    try {
      await fetch('/api/repo/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: repoId, cmd: `rm -rf ${p}` }) })
      await load()
    } catch {}
  }

  const renamePath = async (p: string) => {
    const name = window.prompt('Rename to', p.split('/').pop() || '')?.trim()
    if (!name) return
    const dir = p.split('/').slice(0, -1).join('/')
    const newPath = dir ? `${dir}/${name}` : name
    try {
      await fetch('/api/repo/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: repoId, cmd: `mv ${p} ${newPath}` }) })
      await load()
    } catch {}
  }

  const toggle = (p: string) => setOpen((s) => ({ ...s, [p]: !s[p] }))

  const onDirKey = (e: React.KeyboardEvent<HTMLDivElement>, p: string) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); if (!open[p]) toggle(p) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (open[p]) toggle(p) }
  }

  const openContext = (e: React.MouseEvent, path: string, type: 'file' | 'dir') => {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, path, type })
  }

  const closeMenu = () => setMenu(null)

  const highlight = (name: string) => {
    if (!filter.trim()) return name
    const i = name.toLowerCase().indexOf(filter.toLowerCase())
    if (i === -1) return name
    return (
      <span>
        {name.slice(0, i)}<mark className="bg-primary-200/60 rounded px-0.5">{name.slice(i, i + filter.length)}</mark>{name.slice(i + filter.length)}
      </span>
    )
  }

  const isPinned = (p: string) => pinned.includes(p)
  const togglePin = (p: string) => setPinned((pp) => isPinned(p) ? pp.filter(x=>x!==p) : [...pp, p])

  const onFileClick = (e: React.MouseEvent, path: string) => {
    if (e.metaKey || e.ctrlKey) {
      setSelectedSet((s) => {
        const next = new Set(s); next.has(path) ? next.delete(path) : next.add(path); return next
      })
      return
    }
    setSelectedSet(new Set())
    onOpen(path)
    setRecent((r) => [path, ...r.filter((p) => p !== path)].slice(0, 5))
  }

  const onDragStart = (e: any, path: string) => {
    try {
      const items = selectedSet.size ? Array.from(selectedSet) : [path]
      e.dataTransfer?.setData('application/json', JSON.stringify({ items }))
    } catch {}
  }
  const onDragOverDir = (e: React.DragEvent, path: string) => { e.preventDefault(); setDropTarget(path) }
  const onDragLeaveDir = () => setDropTarget(null)
  const onDropDir = async (e: React.DragEvent, dest: string) => {
    e.preventDefault(); setDropTarget(null)
    try {
      const raw = e.dataTransfer.getData('application/json')
      const { items } = JSON.parse(raw || '{}')
      if (!Array.isArray(items)) return
      for (const src of items) {
        await fetch('/api/repo/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: repoId, cmd: `mv ${src} ${dest}/` }) })
      }
      await load()
    } catch {}
  }

  const render = (nodes: Node[], depth = 0) => (
    <ul className="space-y-1" role="group">
      {nodes.map((n) => (
        <li key={n.path}>
          {n.type === 'dir' ? (
            <motion.div
              layout
              whileHover={{ x: 2 }}
              className={`flex items-center gap-1 cursor-pointer select-none px-2 py-1 rounded hover:bg-muted/50 focus:bg-muted/50 outline-none ${dropTarget===n.path? 'ring-1 ring-primary-400':''}`}
              onClick={() => toggle(n.path)}
              onContextMenu={(e) => openContext(e, n.path, 'dir')}
              onKeyDown={(e) => onDirKey(e, n.path)}
              onDragOver={(e) => onDragOverDir(e, n.path)}
              onDragLeave={onDragLeaveDir}
              onDrop={(e) => onDropDir(e, n.path)}
              tabIndex={0}
              role="treeitem"
              aria-expanded={!!open[n.path]}
              style={{ paddingLeft: depth * 10 }}
            >
              {open[n.path] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {open[n.path] ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
              <span className="text-sm">{highlight(n.name)}</span>
              <button className={`ml-auto p-1 rounded hover:bg-muted/40 ${isPinned(n.path)?'text-amber-500':''}`} onClick={(e) => { e.stopPropagation(); togglePin(n.path) }} aria-label="Pin"><Star className="w-3.5 h-3.5" /></button>
            </motion.div>
          ) : (
            <motion.div
              layout
              whileHover={{ x: 2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              aria-selected={selectedPath === n.path}
              className={`relative flex items-center gap-2 w-full text-left px-2 py-1 rounded border ${selectedPath === n.path ? 'bg-primary-100/90 border-primary-100 shadow-soft' : selectedSet.has(n.path) ? 'bg-muted/40 border-border' : 'border-transparent hover:bg-muted/50'}`}
              onClick={(e) => onFileClick(e, n.path)}
              onContextMenu={(e) => openContext(e, n.path, 'file')}
              draggable
              onDragStart={(e) => onDragStart(e, n.path)}
              data-file-item="true"
              role="treeitem"
              title={n.path}
              style={{ paddingLeft: depth * 10 }}
              tabIndex={-1}
            >
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r ${selectedPath === n.path ? 'bg-primary-500' : 'bg-transparent'}`} />
              <FileText className={`w-3.5 h-3.5 ${selectedPath === n.path ? 'text-primary-600' : ''}`} />
              <span className={`text-sm truncate ${selectedPath === n.path ? 'text-foreground' : ''}`}>{highlight(n.name)}</span>
              <span className="ml-auto text-[10px] text-muted-foreground font-mono">{n.name.split('.').pop()?.toUpperCase()}</span>
              <button className={`p-1 rounded hover:bg-muted/40 ${isPinned(n.path)?'text-amber-500':''}`} onClick={(e) => { e.stopPropagation(); togglePin(n.path) }} aria-label="Pin"><Star className="w-3.5 h-3.5" /></button>
            </motion.div>
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
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-file-item="true"]'))
    const index = items.findIndex((el) => el === document.activeElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = items[Math.min(index + 1, items.length - 1)] || items[0]
      next?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = items[Math.max(index - 1, 0)] || items[items.length - 1]
      prev?.focus()
    } else if (e.key === 'Enter' && (document.activeElement as HTMLElement)?.dataset?.fileItem === 'true') {
      ;(document.activeElement as HTMLElement)?.click()
    } else if (e.key === 'Backspace' && (document.activeElement as HTMLElement)?.dataset?.fileItem === 'true') {
      const p = (document.activeElement as HTMLElement).getAttribute('title') || ''
      if (p) removePath(p)
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
      e.preventDefault(); load()
    } else if (e.key === '0') {
      e.preventDefault(); collapseAll()
    } else if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key.toLowerCase() === 'n')) {
      e.preventDefault(); create('dir')
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
      e.preventDefault(); create('file')
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

  useEffect(() => {
    const onReveal = (e: any) => {
      const path = e?.detail?.path as string
      if (!path) return
      // expand parents to reveal
      const parts = path.split('/').slice(0, -1)
      let acc = ''
      const next: Record<string, boolean> = {}
      for (const part of parts) {
        acc = acc ? `${acc}/${part}` : part
        next[acc] = true
      }
      setOpen((s) => ({ ...s, ...next }))
      // focus the file if exists, after layout
      setTimeout(() => {
        const item = containerRef.current?.querySelector(`[data-file-item="true"][title="${CSS.escape(path)}"]`) as HTMLElement | null
        item?.focus()
      }, 50)
    }
    window.addEventListener('ide:reveal' as any, onReveal)
    return () => window.removeEventListener('ide:reveal' as any, onReveal)
  }, [])

  return (
    <div ref={containerRef} className="h-full overflow-auto outline-none" tabIndex={0} onKeyDown={onKeyDown} role="tree" aria-label="Files">
      {!!pinned.length && (
        <div className="px-2 pt-2 pb-1">
          <div className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground mb-1">Pinned</div>
          <div className="space-y-1">
            {pinned.map((p) => (
              <button key={p} className="w-full text-left px-2 py-1 rounded hover:bg-muted/50 truncate" onClick={() => onOpen(p)} title={p}>{p}</button>
            ))}
          </div>
        </div>
      )}
      {!!(openEditors && openEditors.length) && (
        <div className="px-2 pt-2 pb-1">
          <div className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground mb-1">Open editors</div>
          <div className="space-y-1">
            {openEditors?.map((p) => (
              <div key={p} className={`flex items-center gap-1 w-full text-left px-2 py-1 rounded hover:bg-muted/50 truncate ${selectedPath === p ? 'bg-muted/40' : ''}`}>
                <button className="flex-1 text-left truncate" onClick={() => onSelectOpenEditor?.(p)} title={p}>{p}</button>
                <button className="p-1 rounded hover:bg-muted/40" onClick={() => onCloseOpenEditor?.(p)} aria-label="Close">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!!recent.length && (
        <div className="px-2 pt-2 pb-1">
          <div className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground mb-1">Open editors</div>
          <div className="space-y-1">
            {recent.map((p) => (
              <button key={p} className={`w-full text-left px-2 py-1 rounded hover:bg-muted/50 truncate ${selectedPath === p ? 'bg-muted/40' : ''}`} onClick={() => onOpen(p)} title={p}>
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
              <Tooltip><TooltipTrigger asChild><button className="p-1.5 rounded-md hover:bg-muted/60" onClick={() => create('file')} aria-label="New file" title="New file (Ctrl/Cmd+N)"><FilePlus className="w-4 h-4" /></button></TooltipTrigger><TooltipContent side="bottom">New file</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button className="p-1.5 rounded-md hover:bg-muted/60" onClick={() => create('dir')} aria-label="New folder" title="New folder (Ctrl/Cmd+Shift+N)"><FolderPlus className="w-4 h-4" /></button></TooltipTrigger><TooltipContent side="bottom">New folder</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button className="p-1.5 rounded-md hover:bg-muted/60" onClick={load} aria-label="Refresh" title="Refresh (Ctrl/Cmd+R)"><RefreshCcw className="w-4 h-4" /></button></TooltipTrigger><TooltipContent side="bottom">Refresh</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button className="p-1.5 rounded-md hover:bg-muted/60" onClick={collapseAll} aria-label="Collapse all" title="Collapse all (0)">▾</button></TooltipTrigger><TooltipContent side="bottom">Collapse all</TooltipContent></Tooltip>
            </div>
          </TooltipProvider>
        </div>
        <div className="relative">
          <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter files…" className="h-8 rounded-lg pr-8" />
          {filter && (
            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted/50" onClick={() => setFilter("")} aria-label="Clear filter">✕</button>
          )}
        </div>
      </div>

      <div className="px-2 py-2">
        {loading ? (
          <div className="text-xs text-muted-foreground p-2">Loading…</div>
        ) : (
          render(filterTree(tree))
        )}
      </div>

      {menu && (
        <div className="fixed inset-0 z-50" onClick={closeMenu} onContextMenu={(e) => { e.preventDefault(); closeMenu() }}>
          <div className="absolute bg-popover border shadow-elevation-2 rounded-md py-1 text-sm" style={{ left: menu.x + 2, top: menu.y + 2 }} role="menu">
            <button className="w-full text-left px-3 py-1.5 hover:bg-muted/50 flex items-center gap-2" onClick={() => { onOpen(menu.path); closeMenu() }}><ExternalLink className="w-4 h-4" /> Open</button>
            <button className="w-full text-left px-3 py-1.5 hover:bg-muted/50 flex items-center gap-2" onClick={() => { window.dispatchEvent(new CustomEvent('ide:openToSide', { detail: { path: menu.path } })); closeMenu() }}>Open to Side</button>
            <button className="w-full text-left px-3 py-1.5 hover:bg-muted/50 flex items-center gap-2" onClick={() => { window.dispatchEvent(new CustomEvent('ide:reveal', { detail: { path: menu.path } })); closeMenu() }}><CornerDownRight className="w-4 h-4" /> Reveal</button>
            <button className="w-full text-left px-3 py-1.5 hover:bg-muted/50 flex items-center gap-2" onClick={() => { navigator.clipboard.writeText(menu.path); closeMenu() }}><Copy className="w-4 h-4" /> Copy Path</button>
            {menu.type === 'file' && <button className="w-full text-left px-3 py-1.5 hover:bg-muted/50 flex items-center gap-2" onClick={() => { /* stub download */ closeMenu() }}><Download className="w-4 h-4" /> Download</button>}
            <div className="h-px my-1 bg-border" />
            {!!selectedSet.size && <div className="px-3 py-1 text-[11px] text-muted-foreground">{selectedSet.size} selected</div>}
            <button className="w-full text-left px-3 py-1.5 hover:bg-muted/50 flex items-center gap-2" onClick={() => { renamePath(menu.path); closeMenu() }}><Pencil className="w-4 h-4" /> Rename (F2)</button>
            <button className="w-full text-left px-3 py-1.5 hover:bg-muted/50 text-destructive flex items-center gap-2" onClick={() => { if (selectedSet.size) { selectedSet.forEach((p)=>removePath(p)); setSelectedSet(new Set()); } else { removePath(menu.path) } closeMenu() }}><Trash2 className="w-4 h-4" /> Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}


