import { NextResponse } from 'next/server'
import { mockSafetyCard } from '@/lib/mock-data'

export const revalidate = 300

export async function GET() {
  return NextResponse.json(mockSafetyCard)
}


