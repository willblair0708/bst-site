"use client"

import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export default function ClientTracker({ page }: { page: string }) {
  useEffect(() => {
    trackPageView(page)
  }, [page])
  return null
}
