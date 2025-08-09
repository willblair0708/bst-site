import { NextResponse } from 'next/server'
import { mockPillarStats } from '@/lib/mock-data'

export const revalidate = 60

export async function GET() {
  return NextResponse.json(mockPillarStats)
}


