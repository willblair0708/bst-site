"use client"

import Link from 'next/link'
import { Button, type ButtonProps } from '@/components/ui/button'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'
import { PropsWithChildren } from 'react'

type TrackedButtonLinkProps = PropsWithChildren<{
  href: string
  event: AnalyticsEvent
  ariaLabel?: string
}> & Pick<ButtonProps, 'variant' | 'size' | 'className'>

export default function TrackedButtonLink({ href, event, ariaLabel, children, variant = 'default', size = 'lg', className }: TrackedButtonLinkProps) {
  return (
    <Link href={href} aria-label={ariaLabel} onClick={() => trackEvent(event, { href })}>
      <Button variant={variant} size={size} className={className}>
        {children}
      </Button>
    </Link>
  )
}

