"use client"

import { usePathname } from 'next/navigation'
import { GitHubHeader } from "@/components/header"
import { ToastProvider } from "@/components/ui/toast"
import { AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/ui/page-transition'

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
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={pathname} className="min-h-[calc(100vh-4rem)]">
            <main>{children}</main>
          </PageTransition>
        </AnimatePresence>
      </div>
    </ToastProvider>
  )
}