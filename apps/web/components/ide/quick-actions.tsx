"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Plus, Quote, ImageDown, BookmarkPlus, Package, ShieldCheck } from "lucide-react"
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


