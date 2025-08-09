import { NextRequest, NextResponse } from 'next/server'
import { mockModelDetails } from '@/lib/mock-data'

export const revalidate = 60

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  const detail = mockModelDetails[slug]
  if (!detail) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(detail)
}


