"use client"

import React from 'react'
import { Receipt } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Copy, ShieldCheck, Server, Cpu, GitCommit, Boxes, ExternalLink, Diff } from 'lucide-react'

export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  const copy = async () => {
    try { await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2)) } catch {}
  }
  return (
    <Card className="p-4 space-y-3 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Run Receipt</div>
        <div className="flex items-center gap-2">
          <a className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md border" href={`/runs/${receipt.run_id}`}>
            <ExternalLink className="w-3 h-3" /> Open run
          </a>
          <button className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md border" onClick={copy}>
            <Copy className="w-3 h-3" /> Copy JSON
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <div className="font-mono">{receipt.run_id}</div>
          <div className="text-muted-foreground">{new Date(receipt.timestamp).toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-[10px]">{receipt.repo}</Badge>
            <Badge variant="outline" className="text-[10px]">user {receipt.user}</Badge>
          </div>
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1"><GitCommit className="w-3 h-3" /> {receipt.commit}</div>
          <div className="inline-flex items-center gap-1"><Boxes className="w-3 h-3" /> code {receipt.code_digest.slice(0,10)}…</div>
          <div className="inline-flex items-center gap-1"><Boxes className="w-3 h-3" /> env {receipt.env_digest.slice(0,10)}…</div>
        </div>
      </div>
      {receipt.runner && (
        <div className="text-xs flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Server className="w-3 h-3" /> {receipt.runner.backend}</span>
          {receipt.runner.image && <span className="truncate max-w-[32ch]">{receipt.runner.image}</span>}
        </div>
      )}
      {receipt.hardware && (
        <div className="text-xs inline-flex items-center gap-2 text-muted-foreground">
          <Cpu className="w-3 h-3" /> {receipt.hardware.cpu} · RAM {receipt.hardware.ram_gb} GB
        </div>
      )}
      <div className="text-xs">
        <div className="font-medium mb-1">Inputs</div>
        <ul className="space-y-1">
          {receipt.data_inputs.map((d, i) => (
            <li key={i} className="flex items-center justify-between gap-2">
              <span className="truncate max-w-[40ch]">{d.uri}</span>
              <span className="text-[10px] text-muted-foreground">{d.tier}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-xs">
        <div className="font-medium mb-1">Outputs</div>
        <ul className="space-y-1">
          {receipt.outputs.map((o) => (
            <li key={o.id || o.name} className="flex items-center justify-between gap-2">
              <span className="truncate max-w-[40ch]">{o.name}</span>
              <span className="text-[10px] text-muted-foreground">{o.type}</span>
            </li>
          ))}
        </ul>
      </div>
      {receipt.signature && (
        <div className="text-xs inline-flex items-center gap-2 text-emerald-600">
          <ShieldCheck className="w-3 h-3" /> Attested
        </div>
      )}
    </Card>
  )
}


