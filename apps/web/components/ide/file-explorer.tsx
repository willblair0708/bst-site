"use client"

import React, { useEffect, useState } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react"

type Node = { name: string; path: string; type: 'file' | 'dir'; children?: Node[] }

export function FileExplorer({ repoId, onOpen }: { repoId: string; onOpen: (p: string) => void }) {
  const [tree, setTree] = useState<Node[]>([])
  const [open, setOpen] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/repo/tree?repo=${encodeURIComponent(repoId)}`)
      const json = await res.json()
      if (json?.tree) setTree(json.tree)
    }
    if (repoId) load()
  }, [repoId])

  const toggle = (p: string) => setOpen((s) => ({ ...s, [p]: !s[p] }))

  const render = (nodes: Node[], depth = 0) => (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li key={n.path}>
          {n.type === 'dir' ? (
            <div className="flex items-center gap-1 cursor-pointer select-none px-2 py-1 rounded hover:bg-muted/50" onClick={() => toggle(n.path)}>
              {open[n.path] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {open[n.path] ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
              <span className="text-sm">{n.name}</span>
            </div>
          ) : (
            <button className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-muted/50" onClick={() => onOpen(n.path)}>
              <FileText className="w-3.5 h-3.5" />
              <span className="text-sm truncate">{n.name}</span>
            </button>
          )}
          {n.children && open[n.path] && (
            <div className="pl-4">{render(n.children, depth + 1)}</div>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <div className="h-full overflow-auto p-2">
      {render(tree)}
    </div>
  )
}


