import { NextRequest } from 'next/server'
import { mockRepoCards } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').toLowerCase()
  const sort = searchParams.get('sort') || 'updated'

  let results = mockRepoCards.filter((r) =>
    !q || r.name.toLowerCase().includes(q) || r.shortDesc.toLowerCase().includes(q)
  )

  if (sort === 'runs30d') {
    results = results.sort((a, b) => b.stats.runs30d - a.stats.runs30d)
  } else if (sort === 'verified') {
    results = results.sort((a, b) => b.badges.verifiedCount - a.badges.verifiedCount)
  } else {
    results = results.sort(
      (a, b) => new Date(b.stats.updatedAt).getTime() - new Date(a.stats.updatedAt).getTime()
    )
  }

  return Response.json({ items: results, nextCursor: null })
}


