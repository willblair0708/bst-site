import { NextResponse } from 'next/server'
import { mockMissionMetrics } from '@/lib/mock-data'

export const revalidate = 60

export async function GET() {
  // TODO: replace with real backend call and add revalidateTag when wired
  return NextResponse.json(mockMissionMetrics)
}


