"use client"

import { usePathname } from 'next/navigation'
import { GitHubHeader } from "@/components/github-header"

const platformRoutes = ['/trials', '/organizations', '/profile', '/dashboard', '/new', '/settings']

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const isPlatformRoute = platformRoutes.some(route => 
    pathname.startsWith(route) || pathname === '/'
  )
  
  const isTrialRoute = !isPlatformRoute || pathname.startsWith('/ctp-') || 
    ['/files', '/issues', '/pull-requests', '/actions', '/projects', '/analytics', '/wiki', '/people'].some(route => 
      pathname.startsWith(route) && !pathname.startsWith('/profile')
    )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GitHubHeader />
      <main>{children}</main>
    </div>
  )
}