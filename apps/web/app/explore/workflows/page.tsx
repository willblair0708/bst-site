"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { DAGGraph } from '@/components/dag-graph'

export default function ExploreWorkflowsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Workflows</h1>
      <Card className="p-4 rounded-2xl">
        <DAGGraph height={300} />
      </Card>
    </div>
  )
}


