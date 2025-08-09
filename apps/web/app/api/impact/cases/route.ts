import { NextResponse } from 'next/server'
import { mockImpactCases } from '@/lib/mock-data'

export const revalidate = 60

export async function GET() {
  return NextResponse.json(mockImpactCases)
}


