"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export function FacetFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const q = params.get('q') ?? ''
  const sort = params.get('sort') ?? 'updated'

  const update = (next: Record<string, string>) => {
    const url = new URL(window.location.href)
    Object.entries(next).forEach(([k, v]) => {
      if (!v) url.searchParams.delete(k)
      else url.searchParams.set(k, v)
    })
    router.push(url.pathname + '?' + url.searchParams.toString())
  }

  return (
    <div className="flex gap-3 items-center">
      <Input
        placeholder="Search repos"
        defaultValue={q}
        onChange={(e) => update({ q: e.target.value })}
        className="w-64"
      />
      <Select defaultValue={sort} onValueChange={(v) => update({ sort: v })}>
        <SelectTrigger className="w-56"><SelectValue placeholder="Sort by" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="updated">Recently updated</SelectItem>
          <SelectItem value="runs30d">Most runs (30d)</SelectItem>
          <SelectItem value="verified">Most verified</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}


