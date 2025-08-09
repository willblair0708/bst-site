import { NextRequest } from 'next/server'
import { mockFileTree } from '@/lib/mock-data'

type Params = { params: { owner: string; name: string } }

export async function GET(req: NextRequest, _ctx: Params) {
  // path and ref are ignored for mock
  return Response.json({ tree: mockFileTree })
}


