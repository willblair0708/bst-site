import { NextRequest, NextResponse } from 'next/server'
import { mockModelCards } from '@/lib/mock-data'

export const revalidate = 60

function getArrayParam(searchParams: URLSearchParams, key: string): string[] | undefined {
  const values = searchParams.getAll(key)
  if (values.length === 0) return undefined
  return values
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').toLowerCase()
  const tasks = getArrayParam(searchParams, 'task[]')
  const modalities = getArrayParam(searchParams, 'modality[]')
  const domains = getArrayParam(searchParams, 'domain[]')
  const licenses = getArrayParam(searchParams, 'license[]')
  const frameworks = getArrayParam(searchParams, 'framework[]')
  const sort = searchParams.get('sort') || 'recent'
  const limit = Math.min(Number(searchParams.get('limit') || '24'), 100)
  const cursor = searchParams.get('cursor')

  let startIndex = 0
  if (cursor) {
    const idx = mockModelCards.findIndex((m) => m.slug === cursor)
    startIndex = idx >= 0 ? idx + 1 : 0
  }

  let filtered = mockModelCards.filter((m) => {
    const matchesQ = !q ||
      m.name.toLowerCase().includes(q) ||
      m.shortDesc.toLowerCase().includes(q) ||
      m.domain.some((d) => d.toLowerCase().includes(q))
    const matchesTask = !tasks || tasks.includes(m.task)
    const matchesMod = !modalities || modalities.some((mm) => m.modalities.includes(mm))
    const matchesDom = !domains || domains.some((dd) => m.domain.includes(dd))
    const matchesLic = !licenses || licenses.includes(m.license)
    // Framework is derived from latest version in real DB; omitted in mock
    const matchesFw = !frameworks || frameworks.length === 0
    return matchesQ && matchesTask && matchesMod && matchesDom && matchesLic && matchesFw
  })

  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'most_reproduced':
        return b.stats.reproductions - a.stats.reproductions
      case 'runs_30d':
        return b.stats.runs30d - a.stats.runs30d
      case 'verified_first':
        return b.badges.verifiedRuns - a.badges.verifiedRuns
      case 'recent':
      default:
        return new Date(b.latest.updatedAt).getTime() - new Date(a.latest.updatedAt).getTime()
    }
  })

  const slice = filtered.slice(startIndex, startIndex + limit)
  const nextCursor = slice.length === limit ? slice[slice.length - 1].slug : null

  return NextResponse.json({ items: slice, nextCursor, total: filtered.length })
}


