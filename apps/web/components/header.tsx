"use client"

import React from 'react'
import { motion, LayoutGroup } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GlobalSearch } from '@/components/global-search'
import { NotificationCenter } from '@/components/notifications'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'



const currentUser = {
  name: "Dr. Sarah Johnson",
  username: "sarah-johnson",
  email: "sarah.johnson@mskcc.org",
  avatar: null,
  role: "Principal Investigator",
  organization: "Memorial Sloan Kettering"
}

export function GitHubHeader() {
  const pathname = usePathname()

  const [ideHref, setIdeHref] = React.useState('/ide?repo=demo')
  React.useEffect(() => {
    try {
      const last = localStorage.getItem('lastRepo')
      if (last) setIdeHref(`/ide?repo=${encodeURIComponent(last)}`)
    } catch {}
  }, [])

  const navItems = [
    { href: ideHref, key: 'ide', label: 'IDE', variant: 'primary' as const },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/models', label: 'Models' },
    { href: '/chat', label: 'Chat' },
  ]

  const isActive = (href: string) => pathname?.startsWith('/ide') ? href.includes('/ide') : pathname?.startsWith(href)

  const baseLinkClasses =
    'text-sm font-medium rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors'

  const getLinkClasses = (href: string, variant?: 'primary') => {
    if (variant === 'primary') {
      return `${baseLinkClasses} px-4 py-2 bg-primary-100 text-foreground border border-primary-100/60 hover:bg-primary-100/80 shadow-elevation-1`
    }
    const active = isActive(href)
    return [
      baseLinkClasses,
      'px-4 py-2',
      active
        ? 'text-foreground bg-muted/70 border border-muted/60'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70',
    ].join(' ')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Pastel glow underlay */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 bg-gradient-to-b from-primary-100/50 via-accent-100/20 to-transparent" />
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 h-20">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-foreground transition-opacity group-hover:opacity-90">
                Runix
              </span>
            </Link>
          </div>

          {/* Center - Search */}
          <div className="flex-1 flex items-center justify-center mx-4 lg:mx-8">
            <div className="w-full max-w-2xl lg:max-w-3xl">
              <GlobalSearch />
            </div>
          </div>

          {/* Right side - Navigation and User */}
          <div className="flex items-center space-x-5">
            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 relative">
              <LayoutGroup id="top-nav">
                {navItems.map(item => {
                  const active = isActive(item.href)
                  return (
                    <div key={item.key || item.href} className="relative">
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full bg-muted/70 border border-muted/60"
                          style={{ zIndex: 0 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={`${getLinkClasses(item.href, item.variant)} relative z-10`}
                      >
                        {item.label}
                      </Link>
                    </div>
                  )
                })}
              </LayoutGroup>
            </nav>



            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <NotificationCenter />

              {/* User avatar */}
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.2 }} className="ml-2">
                <Avatar className="h-10 w-10 border border-primary-600/20 dark:border-primary-700/30 shadow-elevation-1">
                  <AvatarFallback className="text-sm font-semibold bg-primary-500 text-primary-foreground">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>


          </div>
        </div>
      </div>
    </header>
  )
}