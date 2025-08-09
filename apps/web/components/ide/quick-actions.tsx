"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Plus, Quote, ImageDown, BookmarkPlus, Package, ShieldCheck, Play, Layers, GitBranch } from "lucide-react"
import Link from 'next/link'
import { motion } from "framer-motion"

export function QuickActions() {
  const items = [
    { icon: Quote, label: "Add citation", shortcut: "⌘⇧C", onClick: () => {} },
    { icon: ImageDown, label: "Extract figure", shortcut: "⌘⇧E", onClick: () => {} },
    { icon: BookmarkPlus, label: "Promote to claim", shortcut: "⌘⇧P", onClick: () => {} },
    { icon: Package, label: "Create bundle", shortcut: "⌘B", onClick: () => {} },
    { icon: ShieldCheck, label: "Regulator view", shortcut: "⌘R", onClick: () => {} },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
          <Button size="icon" variant="ghost" className="rounded-full w-9 h-9 border border-border bg-background/80 hover:bg-muted/60 shadow-soft">
            <MoreVertical className="w-4 h-4" />
            <span className="sr-only">Quick actions</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="center" className="rounded-xl">
        <div className="px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">Shortcuts</div>
        <div className="px-2 pb-1 flex items-center gap-2">
          <Link href="/runs" className="text-xs px-2 py-1 rounded-md border inline-flex items-center gap-1"><Play className="w-3 h-3" />Runs</Link>
          <Link href="/explore/repos" className="text-xs px-2 py-1 rounded-md border inline-flex items-center gap-1"><Layers className="w-3 h-3" />Repos</Link>
          <Link href="/explore/workflows" className="text-xs px-2 py-1 rounded-md border inline-flex items-center gap-1"><GitBranch className="w-3 h-3" />Workflows</Link>
        </div>
        <div className="h-px my-1 bg-border" />
        {items.map(({ icon: Icon, label, shortcut, onClick }) => (
          <DropdownMenuItem key={label} onClick={onClick} className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
            <kbd className="ml-auto text-[10px] px-1 py-0.5 rounded bg-muted text-muted-foreground border">{shortcut}</kbd>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


