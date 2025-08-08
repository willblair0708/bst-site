"use client"

import React, { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { TerminalConsole } from "@/components/ide/terminal-console"
import { ProtocolEditor } from "@/components/protocol-editor"
import { DAGGraph } from "@/components/dag-graph"
import EvidenceDrawer from "@/components/evidence-drawer"
import { QuickActions } from "@/components/ide/quick-actions"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Layers, PanelRight } from "lucide-react"
import { WorkspaceTabs } from "@/components/ide/workspace-tabs"
import { RepoEditor } from "@/components/ide/repo-editor"

export function Shell({ repoId }: { repoId?: string }) {
  const jobs = useMemo(() => [
    {
      name: "Scholar · Literature pass",
      status: "success" as const,
      log: "Fetched 12 sources via Crossref/arXiv. Ranked top-5. Extracted 8 figures.",
      artifacts: [
        { name: "sources.json", url: "#", size: "12 KB" },
        { name: "figures.zip", url: "#", size: "1.2 MB" },
      ],
    },
    {
      name: "Analyst · Notebook run",
      status: "running" as const,
      log: "Executing cells 1-12… Installing deps… Running sims…",
      artifacts: [],
    },
  ], [])

  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="h-full overflow-hidden">
      {/* Main column */}
      <div className="h-full flex flex-col min-w-0 overflow-hidden">
        {/* Center work area */}
        <div className="flex-1 grid grid-rows-[minmax(0,1fr)_auto] gap-2 min-h-0 overflow-hidden p-2">
          <div className="grid grid-cols-[240px_minmax(0,1fr)_360px] gap-2 min-h-0 overflow-hidden">
            {/* Explorer */}
            <div className="rounded-2xl bg-card border border-border shadow-elevation-1 overflow-hidden min-h-0">
              <WorkspaceTabs repoId={repoId || 'demo'} onOpenFile={() => {}} />
            </div>

            {/* Notebook/Protocol editor */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.002 }}
              className="rounded-2xl bg-primary-100/60 border border-border shadow-elevation-2 overflow-hidden min-h-0 hover:animate-spark-glow"
            >
              {/* Swap in RepoEditor when file is opened (todo: state) */}
              <ProtocolEditor />
            </motion.div>

            {/* Right rail: Evidence Drawer trigger + Graph view */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
              className="flex flex-col min-h-0 overflow-hidden"
            >
              <motion.div
                whileHover={prefersReducedMotion ? undefined : { scale: 1.005 }}
                className="rounded-2xl bg-card border border-border shadow-elevation-1 p-2 mb-2 hover:animate-spark-glow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-viz-purple-500" />
                    <span className="text-sm font-medium">Evidence</span>
                  </div>
                  <EvidenceDrawer
                    jobs={jobs}
                    trigger={<Button size="sm" variant="outline" className="rounded-xl">Open</Button>}
                  />
                </div>
              </motion.div>

              <ScrollArea className="rounded-2xl bg-card border border-border shadow-elevation-1 p-2 flex-1">
                <DAGGraph nodes={[]} height={260} className="h-full" />
              </ScrollArea>
              {/* floating quick actions */}
              <div className="absolute right-2 bottom-2">
                <QuickActions />
              </div>
            </motion.div>
          </div>

          {/* Bottom: Agent console */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
            className="rounded-2xl bg-collaboration-100/70 border border-border shadow-elevation-2 overflow-hidden hover:animate-spark-glow"
          >
            <TerminalConsole repoId={repoId || 'demo'} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}


