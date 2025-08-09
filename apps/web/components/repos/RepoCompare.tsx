import { RepoCard } from '@/lib/types'

export function RepoCompare({ items }: { items: RepoCard[] }) {
  if (!items?.length) return null
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border rounded-xl shadow-lg p-3 flex gap-4 items-center z-50">
      <div className="text-sm">Compare:</div>
      {items.map((r) => (
        <div key={r.slug} className="text-sm font-medium">{r.owner.handle}/{r.name}</div>
      ))}
      <button className="px-3 py-1 rounded-md border">Open compare</button>
    </div>
  )
}


