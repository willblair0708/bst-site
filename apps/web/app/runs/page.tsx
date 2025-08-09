"use client"

import React from 'react'
import Link from 'next/link'
import { mockRuns } from '@/lib/mock-data'
import type { Run } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default function RunsPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Runs</h1>
        <Link href="/ide?repo=demo" className="text-sm px-3 py-1 rounded-md border">Open IDE</Link>
      </div>
      <div className="grid gap-3">
        {mockRuns.map((r: Run) => (
          <Link key={r.id} href={`/runs/${r.id}`}>
            <Card className="p-3 hover:bg-muted/30 transition-colors rounded-2xl">
              <div className="flex items-center justify-between text-sm">
                <div className="font-mono">{r.id}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{r.status}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(r.receipt.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {r.receipt.repo} · {r.receipt.runner?.backend} · commit {r.receipt.commit}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}


