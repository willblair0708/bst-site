"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RepoDetail } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'

export function RepoHeader({ detail }: { detail: RepoDetail }) {
  const r = detail.repo
  const slug = `${r.owner.handle}/${r.name}`
  const startReproduce = async () => {
    trackEvent('cta_reproduce_click', { slug })
    await fetch(`/api/repos/${slug}/runs`, { method: 'POST', body: JSON.stringify({ inputs: detail.otp?.baseline }) })
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">{slug}</div>
          <div className="text-sm text-muted-foreground">{r.license} • Updated {new Date(r.stats.updatedAt).toLocaleString()}</div>
        </div>
        <div className="flex gap-2">
          <Link href={`/ide?repo=${encodeURIComponent(slug)}`}><Button>Open in IDE</Button></Link>
          <Button onClick={startReproduce} variant="secondary">Reproduce baseline</Button>
          <Button variant="outline">Request review</Button>
          <Button variant="outline">Book testbed</Button>
        </div>
      </div>
      <div className="flex gap-2">
        {r.badges.runnable && <Badge>Runnable</Badge>}
        <Badge variant="secondary">Verified {r.badges.verifiedCount}</Badge>
        {r.badges.irbReady && <Badge variant="outline">IRB-ready</Badge>}
        <Badge variant="secondary">{r.badges.safetyTier}</Badge>
        <Badge variant="secondary">{r.badges.dataTier}</Badge>
      </div>
    </div>
  )
}


