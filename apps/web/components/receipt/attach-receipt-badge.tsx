"use client"

import React from 'react'
import { Receipt } from '@/lib/types'
import { Layers } from 'lucide-react'

export function AttachReceiptBadge({ onAttach }: { onAttach: (receiptId: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('r_01J7X8')
  return (
    <div className="relative inline-block">
      <button className="text-xs border rounded-md px-2 py-1 inline-flex items-center gap-1" onClick={() => setOpen((o) => !o)}>
        <Layers className="w-3 h-3 text-viz-purple-500" /> Attach receipt
      </button>
      {open && (
        <div className="absolute right-0 mt-1 z-50 p-2 rounded-lg border bg-popover min-w-[220px]">
          <div className="text-xs mb-1">Receipt ID</div>
          <input value={value} onChange={(e) => setValue(e.target.value)} className="w-full text-xs border rounded-md px-2 py-1 bg-background" />
          <div className="flex justify-end mt-2">
            <button className="text-xs px-2 py-1 rounded-md border" onClick={() => { onAttach(value); setOpen(false) }}>Attach</button>
          </div>
        </div>
      )}
    </div>
  )
}


