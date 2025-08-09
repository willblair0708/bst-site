import { NextRequest, NextResponse } from 'next/server'
import { mockPrograms } from '@/lib/mock-data'

export const revalidate = 60

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Math.max(0, Number(limitParam)) : undefined
  const data = limit ? mockPrograms.slice(0, limit) : mockPrograms
  return NextResponse.json(data)
}


