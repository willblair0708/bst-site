"use client"
import { useEffect, useState } from 'react'

type Props = { slug: string }

export function RunsTable({ slug }: Props) {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => {
    fetch(`/api/repos/${slug}/runs`).then((r) => r.json()).then((d) => setItems(d?.items ?? []))
  }, [slug])
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-muted-foreground">
          <th className="py-2">Run</th>
          <th className="py-2">Status</th>
          <th className="py-2">Started</th>
          <th className="py-2">Duration</th>
          <th className="py-2">Receipt</th>
        </tr>
      </thead>
      <tbody>
        {items.map((r: any) => (
          <tr key={r.id} className="border-t">
            <td className="py-2">{r.id}</td>
            <td className="py-2">{r.status}</td>
            <td className="py-2">{new Date(r.startedAt).toLocaleString()}</td>
            <td className="py-2">{r.durationSec ? `${r.durationSec}s` : '-'}</td>
            <td className="py-2">{r.receiptId ? <a className="underline" href={`/#receipt/${r.receiptId}`}>View</a> : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


