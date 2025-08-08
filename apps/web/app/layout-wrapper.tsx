"use client"

import { usePathname } from 'next/navigation'
import { GitHubHeader } from "@/components/header"
import { ToastProvider } from "@/components/ui/toast"

const platformRoutes = ['/trials', '/organizations', '/profile', '/dashboard', '/new', '/settings']
const noHeaderRoutes = ['/chat', '/ide']

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const isPlatformRoute = platformRoutes.some(route => 
    pathname?.startsWith(route) || pathname === '/'
  )
  
  const isTrialRoute = !isPlatformRoute || pathname?.startsWith('/ctp-') || 
    ['/files', '/issues', '/pull-requests', '/actions', '/projects', '/analytics', '/wiki', '/people'].some(route => 
      pathname?.startsWith(route) && !pathname?.startsWith('/profile')
    )

  const shouldShowHeader = !noHeaderRoutes.some(route => pathname?.startsWith(route))

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        {shouldShowHeader && <GitHubHeader />}
        <main>{children}</main>
      </div>
    </ToastProvider>
  )
}