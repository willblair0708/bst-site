"use client"
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FacetFilters } from '@/components/repos/FacetFilters'
import { RepoCard } from '@/components/repos/RepoCard'

export default function ReposCatalogPage() {
  const params = useSearchParams()
  const [items, setItems] = useState<any[]>([])
  const qs = useMemo(() => params.toString(), [params])

  useEffect(() => {
    const url = '/api/repos' + (qs ? `?${qs}` : '')
    fetch(url).then((r) => r.json()).then((data) => setItems(data?.items ?? []))
  }, [qs])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Repositories</h1>
        <FacetFilters />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((r: any) => (
          <RepoCard key={r.slug} repo={r} />
        ))}
      </div>
    </div>
  )
}


