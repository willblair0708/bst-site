"use client"

import React, { useEffect, useState } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react"
import { motion } from "framer-motion"

type Node = { name: string; path: string; type: 'file' | 'dir'; children?: Node[] }

export function FileExplorer({ repoId, onOpen, selectedPath, refreshKey }: { repoId: string; onOpen: (p: string) => void; selectedPath?: string; refreshKey?: number }) {
  const [tree, setTree] = useState<Node[]>([])
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/repo/tree?repo=${encodeURIComponent(repoId)}`)
        const json = await res.json()
        if (json?.tree) setTree(json.tree)
      } finally {
        setLoading(false)
      }
    }
    if (repoId) load()
  }, [repoId, refreshKey])

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
              onClick={() => onOpen(n.path)}
            >
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r ${selectedPath === n.path ? 'bg-primary-500' : 'bg-transparent'}`} />
              <FileText className={`w-3.5 h-3.5 ${selectedPath === n.path ? 'text-primary-600' : ''}`} />
              <span className={`text-sm truncate ${selectedPath === n.path ? 'text-foreground' : ''}`}>{n.name}</span>
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

  return (
    <div ref={containerRef} className="h-full overflow-auto p-2 outline-none" tabIndex={0} onKeyDown={onKeyDown}>
      {loading ? (
        <div className="text-xs text-muted-foreground p-2">Loading…</div>
      ) : (
        render(tree)
      )}
    </div>
  )
}


