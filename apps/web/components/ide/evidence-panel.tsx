"use client"

import React from "react"
import { Layers, Timer, Coins, Play, Pause, CircleCheck, CircleAlert } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArtifactsPanel } from "@/components/ide/artifacts-panel"

export type EvidenceJob = {
  id: string
  name: string
  status: 'success' | 'running' | 'failure'
  startedAt: string
  durationSec?: number
  costCents?: number
  log?: string
  artifacts: Array<{ name: string; path: string; type: 'csv'|'txt'|'json'|'unknown'; preview?: any }>
}

export function EvidencePanel({ jobs }: { jobs: EvidenceJob[] }) {
  if (!jobs.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-sm text-muted-foreground">
          <Layers className="w-6 h-6 mx-auto mb-2 text-viz-purple-500" />
          <div>No evidence yet</div>
          <div className="text-xs">Run a protocol from the right rail</div>
        </div>
      </div>
    )
  }
  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-2xl border bg-background/70">
            <div className="sticky top-0 z-10 px-3 py-2 border-b bg-card/80 backdrop-blur rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                {job.status === 'success' && <CircleCheck className="w-4 h-4 text-emerald-500" />}
                {job.status === 'running' && <Play className="w-4 h-4 text-amber-500" />}
                {job.status === 'failure' && <CircleAlert className="w-4 h-4 text-rose-500" />}
                <div className="truncate text-sm font-medium">{job.name}</div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Timer className="w-3 h-3" />{job.durationSec ? `${job.durationSec}s` : '—'}</span>
                <span className="inline-flex items-center gap-1"><Coins className="w-3 h-3" />{job.costCents ? `$${(job.costCents/100).toFixed(2)}` : '—'}</span>
              </div>
            </div>
            <div className="p-2">
              <ArtifactsPanel artifacts={job.artifacts as any} />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}