"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { mockRuns } from '@/lib/mock-data'
import { ReceiptCard } from '@/components/receipt/receipt-card'
import { DAGGraph } from '@/components/dag-graph'
import { Card } from '@/components/ui/card'

export default function RunDetailPage() {
  const params = useParams<{ id: string }>()
  const run = mockRuns.find((r) => r.id === params?.id)
  if (!run) return <div className="p-6">Run not found</div>

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Run {run.id}</div>
        <Link href="/runs" className="text-sm px-3 py-1 rounded-md border">Back to Runs</Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReceiptCard receipt={run.receipt} />
        <Card className="p-4 rounded-2xl">
          <div className="text-sm font-semibold mb-2">Provenance</div>
          <DAGGraph height={320} />
        </Card>
      </div>
    </div>
  )
}


