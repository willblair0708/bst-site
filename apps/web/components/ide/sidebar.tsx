"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Beaker, FolderGit2, PackageSearch, Layers, GitPullRequest, Files, Database, Compass, Command, ChevronsLeft, ChevronsRight } from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const groups = [
  {
    label: "Projects",
    items: [
      { label: "Hypotheses", icon: Compass, href: "/ide?tab=hypotheses" },
      { label: "Drafts", icon: Files, href: "/ide?tab=drafts" },
      { label: "Datasets", icon: Database, href: "/ide?tab=datasets" },
      { label: "Bundles", icon: PackageSearch, href: "/ide?tab=bundles" },
    ],
  },
  {
    label: "Review",
    items: [
      { label: "Evidence", icon: Layers, href: "/ide?tab=evidence" },
      { label: "PRs", icon: GitPullRequest, href: "/pull-requests" },
      { label: "Repos", icon: FolderGit2, href: "/repo" },
    ],
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { width: 240 }}
      animate={prefersReducedMotion ? {} : { width: collapsed ? 56 : 240 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`transition-all duration-200 shrink-0 h-full border-r border-border bg-background/60 backdrop-blur-xl ${collapsed ? "w-14" : "w-60"}`}
    >
      <div className="p-2 border-b">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full w-9 h-9 border border-border bg-background/80 hover:bg-muted/50"
              aria-label="Command Palette"
            >
              <Command className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full w-9 h-9 border border-border bg-background/80 hover:bg-muted/50"
              onClick={() => setCollapsed(v => !v)}
              aria-label="Expand sidebar"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="shadow-none rounded-2xl border border-border text-foreground bg-muted/30 hover:bg-muted/50 w-full justify-start px-3"
              aria-label="Command Palette"
            >
              <Command className="w-4 h-4" />
              <motion.div
                key="label"
                initial={prefersReducedMotion ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center flex-1"
              >
                <span className="ml-2 text-[13px] font-medium whitespace-nowrap">Command Palette</span>
                <kbd className="pointer-events-none ml-auto inline-flex h-4 select-none items-center gap-1 rounded-xl border bg-background px-1 font-mono text-[9px] font-medium text-muted-foreground shadow-sm">
                  <span className="text-[10px]">⌘</span>K
                </kbd>
              </motion.div>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-xl w-8 h-8 border border-border hover:bg-muted/50"
              onClick={() => setCollapsed(v => !v)}
              aria-label="Collapse sidebar"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <ScrollArea className="h-[calc(100%-56px)] p-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  key="group-title"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="px-2 text-[11px] uppercase tracking-wide text-muted-foreground mb-2"
                >
                  {group.label}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link key={item.label} href={item.href} className="block">
                  <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : "px-2"} py-2 rounded-xl hover:bg-muted/50 transition-colors`}>
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          key="item-label"
                          initial={prefersReducedMotion ? false : { opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.15 }}
                          className="text-[13px]"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-2 border-t">
        <Button size={collapsed ? "icon" : "sm"} className={`rounded-xl ${collapsed ? "w-8 h-8" : "w-full"}`}>
          <Beaker className="w-4 h-4" />
          {!collapsed && <span className="ml-2">New Bundle</span>}
        </Button>
      </div>
    </motion.div>
  )
}


