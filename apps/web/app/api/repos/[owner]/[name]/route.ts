import { NextRequest } from 'next/server'
import { getRepoDetail } from '@/lib/mock-data'

type Params = { params: { owner: string; name: string } }

export async function GET(req: NextRequest, { params }: Params) {
  const { owner, name } = params
  const detail = getRepoDetail(owner, name)
  return Response.json(detail)
}


