"use client"

import React, { useMemo } from "react"
import { Sidebar } from "@/components/ide/sidebar"
import { AgentConsole } from "@/components/ide/agent-console"
import { ProtocolEditor } from "@/components/protocol-editor"
import { DAGGraph } from "@/components/dag-graph"
import EvidenceDrawer from "@/components/evidence-drawer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Layers, PanelRight } from "lucide-react"

export function Shell() {
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

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">{/* subtract site header (h-20) */}
      {/* Left rail */}
      <Sidebar />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Center work area */}
        <div className="flex-1 grid grid-rows-[minmax(0,1fr)_auto] gap-2 min-h-0 overflow-hidden p-2">
          <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-2 min-h-0 overflow-hidden">
            {/* Notebook/Protocol editor */}
            <div className="rounded-2xl bg-primary-100/60 border border-border shadow-elevation-2 overflow-hidden min-h-0">
              <ProtocolEditor />
            </div>

            {/* Right rail: Evidence Drawer trigger + Graph view */}
            <div className="flex flex-col min-h-0 overflow-hidden">
              <div className="rounded-2xl bg-card border border-border shadow-elevation-1 p-2 mb-2">
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
              </div>

              <ScrollArea className="rounded-2xl bg-card border border-border shadow-elevation-1 p-2 flex-1">
                <DAGGraph nodes={[]} height={260} className="h-full" />
              </ScrollArea>
            </div>
          </div>

          {/* Bottom: Agent console */}
          <div className="rounded-2xl bg-collaboration-100/70 border border-border shadow-elevation-2 overflow-hidden">
            <AgentConsole />
          </div>
        </div>
      </div>
    </div>
  )
}


