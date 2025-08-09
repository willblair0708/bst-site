"use client"

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

const templates = [
  { id: 'otp-minimal', title: 'Minimal OTP', desc: 'protocol.md + environment.lock + workflow.yaml' },
  { id: 'otp-ml', title: 'ML OTP', desc: 'Adds baseline.json and dataset_card.json' },
]

export default function ExploreTemplatesPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Templates</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map((t) => (
          <Card key={t.id} className="p-4 rounded-2xl space-y-1">
            <div className="text-sm font-semibold">{t.title}</div>
            <div className="text-xs text-muted-foreground">{t.desc}</div>
            <div className="pt-2">
              <Link href={`/ide?repo=demo`} className="text-sm px-3 py-1 rounded-md border">Create</Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


