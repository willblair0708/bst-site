"use client"

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RepoCard as RepoCardType } from '@/lib/types'
import { GitFork, CheckCircle2, Shield, Gauge, Clock } from 'lucide-react'

export function RepoCard({ repo }: { repo: RepoCardType }) {
  const tierColor: Record<string, string> = {
    Open: 'border-emerald-300 text-emerald-700',
    Restricted: 'border-amber-300 text-amber-700',
    Regulated: 'border-rose-300 text-rose-700',
  }

  return (
    <Card className="p-4 rounded-2xl bg-card border hover:shadow-elevation-2 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-muted flex items-center justify-center overflow-hidden">
              {/* avatar stub */}
              <span className="text-[10px] font-mono">{repo.owner.handle.slice(0,2)}</span>
            </div>
            <div className="truncate">
              <div className="text-sm font-semibold truncate">{repo.owner.handle}/{repo.name}</div>
              <div className="text-xs text-muted-foreground truncate">{repo.shortDesc}</div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {repo.badges.runnable && (
              <Badge variant="outline" className="text-[10px]">Runnable</Badge>
            )}
            {repo.badges.irbReady && (
              <Badge variant="outline" className="text-[10px] inline-flex items-center gap-1"><Shield className="w-3 h-3" /> IRB-ready</Badge>
            )}
            <Badge variant="outline" className="text-[10px]">{repo.license}</Badge>
            <Badge variant="outline" className={`text-[10px] ${tierColor[repo.badges.dataTier] || ''}`}>{repo.badges.dataTier}</Badge>
            <Badge variant="outline" className="text-[10px]">S{repo.badges.safetyTier.slice(1)}</Badge>
            <Badge variant="outline" className="text-[10px] inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {repo.badges.verifiedCount}</Badge>
          </div>
        </div>
        <div className="text-right text-[11px] text-muted-foreground">
          <div className="inline-flex items-center gap-1"><Gauge className="w-3 h-3" /> {repo.stats.runs30d} runs</div>
          <div className="inline-flex items-center gap-1 ml-2"><GitFork className="w-3 h-3" /> {repo.stats.replications} repl.</div>
          <div className="mt-1"><Clock className="w-3 h-3 inline mr-1" />{new Date(repo.stats.updatedAt).toLocaleDateString()}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <Link href={`/ide?repo=demo`} className="px-3 py-1 rounded-md border">Open in IDE</Link>
        <Link href={`/explore/workflows`} className="px-3 py-1 rounded-md border">Workflows</Link>
      </div>
    </Card>
  )
}


