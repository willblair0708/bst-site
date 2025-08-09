import Link from 'next/link'
import Image from 'next/image'
import { RepoCard as RepoCardType } from '@/lib/types'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { trackEvent } from '@/lib/analytics'

type Props = { repo: RepoCardType }

export function RepoCard({ repo }: Props) {
  const href = `/repos/${repo.owner.handle}/${repo.name}`
  return (
    <Card className="p-4 flex flex-col justify-between">
      <div className="flex items-center gap-3">
        {repo.owner.avatarUrl && (
          <Image src={repo.owner.avatarUrl} alt={repo.owner.handle} width={24} height={24} className="rounded-full" />
        )}
        <div className="min-w-0">
          <Link href={href} onClick={() => trackEvent('repo_card_clicked', { slug: repo.slug })}>
            <div className="font-semibold truncate">{repo.owner.handle}/{repo.name}</div>
          </Link>
          <div className="text-sm text-muted-foreground truncate">{repo.shortDesc}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {repo.badges.runnable && <Badge>Runnable</Badge>}
        <Badge variant="secondary">Verified {repo.badges.verifiedCount}</Badge>
        {repo.badges.irbReady && <Badge variant="outline">IRB-ready</Badge>}
        <Badge variant="secondary">{repo.badges.safetyTier}</Badge>
        <Badge variant="secondary">{repo.license}</Badge>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">Runs 30d: {repo.stats.runs30d} • Replications: {repo.stats.replications}</div>
        <div className="flex gap-2">
          <Link href={href}><Button size="sm" variant="secondary">Open</Button></Link>
          <Link href={`/ide?repo=${encodeURIComponent(repo.slug)}`}><Button size="sm">Open in IDE</Button></Link>
        </div>
      </div>
    </Card>
  )
}


