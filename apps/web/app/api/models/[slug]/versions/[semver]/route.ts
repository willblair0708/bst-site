import { NextRequest, NextResponse } from 'next/server'
import { mockModelDetails } from '@/lib/mock-data'

export const revalidate = 60

export async function GET(_request: NextRequest, { params }: { params: { slug: string; semver: string } }) {
  const { slug, semver } = params
  const detail = mockModelDetails[slug]
  if (!detail) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const version = detail.versions.find((v) => v.semver === semver)
  if (!version) return NextResponse.json({ error: 'Version not found' }, { status: 404 })
  return NextResponse.json({ model: detail.model, version, artifacts: detail.artifacts, evals: (detail.evals || []).filter((e) => e.version === semver) })
}


