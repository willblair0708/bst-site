"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Beaker, FolderGit2, PackageSearch, Layers, GitPullRequest, Files, Database, Rocket, Compass, Command } from "lucide-react"

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
  return (
    <div className="w-60 shrink-0 h-full border-r border-border bg-background/60 backdrop-blur-xl">
      <div className="p-2 border-b">
        <Button variant="outline" className="w-full rounded-2xl justify-start text-muted-foreground bg-muted/30 hover:bg-muted/50">
          <Command className="w-4 h-4 mr-2" />
          Command Palette
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded-xl border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
      <ScrollArea className="h-[calc(100%-56px)] p-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            <div className="px-2 text-[11px] uppercase tracking-wide text-muted-foreground mb-2">{group.label}</div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link key={item.label} href={item.href} className="block">
                  <div className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-muted/50 transition-colors">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[13px]">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-2 border-t">
        <Button size="sm" className="w-full rounded-xl">
          <Beaker className="w-4 h-4 mr-2" />
          New Bundle
        </Button>
      </div>
    </div>
  )
}


