import { NextRequest } from 'next/server'
import { mockRuns } from '@/lib/mock-data'

type Params = { params: { owner: string; name: string } }

export async function GET(req: NextRequest, { params }: Params) {
  const { owner, name } = params
  const repoSlug = `${owner}/${name}`
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const items = mockRuns.filter((r) => r.repoSlug === repoSlug && (!status || r.status === status))
  return Response.json({ items, nextCursor: null })
}

export async function POST(req: NextRequest, { params }: Params) {
  const { owner, name } = params
  const body = await req.json().catch(() => ({}))
  const runId = `r_${Math.random().toString(36).slice(2, 8)}`
  const startedAt = new Date().toISOString()
  return Response.json({
    id: runId,
    repoSlug: `${owner}/${name}`,
    status: 'queued',
    startedAt,
    inputs: body?.inputs ?? {},
  })
}


