"use client"
import { useEffect, useState } from 'react'
import { RepoCard } from '@/components/repos/RepoCard'
import { FacetFilters } from '@/components/repos/FacetFilters'

export default function ExploreReposPage() {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/repos').then((r) => r.json()).then((d) => setItems(d?.items ?? []))
  }, [])
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Repositories</h1>
        <FacetFilters />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((r) => (
          <RepoCard key={r.slug} repo={r} />
        ))}
      </div>
    </div>
  )
}


