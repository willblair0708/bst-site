'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Brain, Download, Filter, Search, Verified, Star, Bot } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ModelCard as ModelCardType } from '@/lib/types'

type SortKey = 'recent' | 'most_reproduced' | 'runs_30d' | 'verified_first'

export default function ModelsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQ = searchParams?.get('q') || ''
  const initialSort = (searchParams?.get('sort') as SortKey) || 'recent'
  const [q, setQ] = useState(initialQ)
  const [sort, setSort] = useState<SortKey>(initialSort)
  const [cards, setCards] = useState<ModelCardType[]>([])
  const [loading, setLoading] = useState(false)

  const fetchModels = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (sort) params.set('sort', sort)
    const res = await fetch(`/api/models?${params.toString()}`, { cache: 'no-store' })
    const data = await res.json()
    setCards(data.items || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchModels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort])

  const verifiedCount = useMemo(() => cards.filter((c) => c.badges.verifiedRuns > 0).length, [cards])

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
        <div className="mb-8">
          <div className="rounded-2xl bg-accent-100 border border-accent-100/60 shadow-elevation-2 overflow-hidden">
            <div className="relative p-6 sm:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-200/70 bg-white/60 text-xs font-semibold text-foreground/80">
                  <span className="text-lg">🛠️</span>
                  <span>Composable Models</span>
                </div>
                <h1 className="mt-3 text-4xl font-display font-light tracking-tight text-foreground">Scientific Models</h1>
                <p className="text-base lg:text-lg text-foreground/80 mt-2">Discover verified AI models for scientific research</p>
              </div>
              <div className="flex items-center md:justify-end gap-2">
                <Button variant="outline" className="rounded-xl">
                  <Download className="h-4 w-4 mr-2" />
                  Export List
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search models..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10 h-12 text-base rounded-xl border-muted/60 shadow-elevation-1 focus-visible:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-56 rounded-xl">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently updated</SelectItem>
                <SelectItem value="most_reproduced">Most reproduced</SelectItem>
                <SelectItem value="runs_30d">Most used (30d)</SelectItem>
                <SelectItem value="verified_first">Verified first</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="ml-auto rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              Facets
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">{loading ? 'Loading…' : `${cards.length} models found`}</p>
          <div className="flex gap-2 items-center">
            <Badge variant="success" className="rounded-xl">
              <Verified className="h-3 w-3 mr-1" />
              {verifiedCount} Verified
            </Badge>
            {sort !== 'recent' && <Badge variant="outline" className="text-xs rounded-xl">Sorted by {sort}</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((model) => (
            <div key={model.slug} className="group rounded-3xl border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-elevation-1 transition-all hover:shadow-elevation-2 hover:border-accent-100/70">
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-accent-100 border border-accent-100/60 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-foreground/80" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/models/${model.slug}`} className="truncate font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                        {model.name}
                      </Link>
                      <div className="text-xs text-muted-foreground truncate">by {model.owner.handle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full">{model.latest.semver}</Badge>
                    {model.badges.verifiedRuns > 0 && (
                      <Badge variant="success" className="text-[10px] px-2 py-0.5 rounded-full">
                        <Verified className="h-3 w-3 mr-1" />
                        Verified {model.badges.verifiedRuns}
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{model.shortDesc}</p>

                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span className="font-mono">{model.stats.reproductions.toLocaleString()}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span className="font-mono">{model.stats.runs30d.toLocaleString()}</span>
                    </span>
                  </div>
                  <Link href={`/models/${model.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded" aria-label={`View ${model.name}`}>
                    <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-xl" role="button">Open</Button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {[...model.modalities.slice(0, 2), ...model.domain.slice(0, 1)].map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5 rounded-full">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && cards.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search</p>
            <Button variant="outline" onClick={() => setQ('')}>Clear search</Button>
          </div>
        )}
      </div>
    </div>
  )
}
