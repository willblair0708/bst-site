"use client"

import React from 'react'
import { motion, LayoutGroup } from 'framer-motion'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
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

  const navItems = [
    { href: '/explore', key: 'explore', label: 'Explore', variant: 'primary' as const, matchPrefixes: ['/explore', '/repos', '/models', '/datasets', '/workflows', '/templates'] },
    { href: '/runs', key: 'runs', label: 'Run', matchPrefixes: ['/ide', '/runs', '/testbeds'] },
    { href: '/dashboard', key: 'dashboard', label: 'Dashboard', matchPrefixes: ['/dashboard'] },
    { href: '/docs', key: 'docs', label: 'Docs', matchPrefixes: ['/docs'] },
    { href: '/policy', key: 'policy', label: 'Policy', matchPrefixes: ['/policy'] },
    { href: '/community', key: 'community', label: 'Community', matchPrefixes: ['/community'] },
    { href: '/mission', key: 'mission', label: 'Mission', matchPrefixes: ['/mission'] },
  ]

  const isActive = (item: { href: string; matchPrefixes?: string[] }) => {
    if (!pathname) return false
    const prefixes = item.matchPrefixes ?? [item.href]
    return prefixes.some(p => pathname.startsWith(p))
  }

  const activeTop = navItems.find(isActive)

  const subNavMap: Record<string, { href: string; label: string }[]> = {
    explore: [
      { href: '/explore', label: 'All' },
      { href: '/repos', label: 'Repositories' },
      { href: '/models', label: 'Models' },
      { href: '/datasets', label: 'Datasets' },
      { href: '/workflows', label: 'Workflows' },
      { href: '/templates', label: 'Templates' },
    ],
    runs: [
      { href: '/ide', label: 'IDE' },
      { href: '/runs', label: 'Runs' },
      { href: '/testbeds', label: 'Testbeds' },
    ],
    docs: [
      { href: '/docs/getting-started', label: 'Getting Started' },
      { href: '/docs/concepts', label: 'Concepts' },
      { href: '/docs/build', label: 'Build' },
      { href: '/docs/ship', label: 'Ship' },
      { href: '/docs/govern', label: 'Govern' },
    ],
    policy: [
      { href: '/policy', label: 'Policy Home' },
      { href: '/policy/templates', label: 'Templates' },
      { href: '/policy/audit-examples', label: 'Audits' },
    ],
    community: [
      { href: '/community', label: 'Threads' },
      { href: '/community/events', label: 'Events' },
      { href: '/community/reproductions', label: 'Reproductions' },
    ],
  }

  const baseLinkClasses =
    'text-sm font-medium rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors'

  const getLinkClasses = (item: { href: string; variant?: 'primary'; matchPrefixes?: string[] }) => {
    if (item.variant === 'primary') {
      // Base style for primary link; when active we clear bg/border below
      return `${baseLinkClasses} px-4 py-2 bg-primary-100 text-foreground border border-primary-100/60 hover:bg-primary-100/80 shadow-elevation-1`
    }
    const active = isActive(item)
    return [
      baseLinkClasses,
      'px-4 py-2',
      active
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70',
    ].join(' ')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
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
                  const active = isActive(item)
                  const subs = item.key ? subNavMap[item.key] : undefined
                  return (
                    <div key={item.key || item.href} className="relative">
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className={`absolute inset-0 rounded-full ${item.variant === 'primary' ? 'bg-primary-100 border border-primary-100/70' : 'bg-muted/70 border border-muted/60'}`}
                          style={{ zIndex: 0 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      {subs ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button aria-current={active ? 'page' : undefined} className={`${getLinkClasses(item)} ${active && item.variant === 'primary' ? 'bg-transparent border-transparent shadow-none' : ''} relative z-10 text-left`}>
                              <span className="inline-flex items-center gap-2">
                                <span>{item.label}</span>
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" aria-hidden>
                                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            side="bottom" 
                            align="start" 
                            className="rounded-lg border bg-background/95 backdrop-blur-sm p-2 shadow-xl min-w-[160px]"
                            asChild
                          >
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                              {subs.map((s, index) => (
                                <DropdownMenuItem asChild key={s.href} className="p-0">
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Link 
                                      href={s.href} 
                                      className="group relative block w-full px-3 py-2.5 text-sm text-foreground rounded-md overflow-hidden transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                                    >
                                      <motion.div
                                        className="absolute inset-0 bg-primary/5 rounded-md opacity-0 group-hover:opacity-100"
                                        initial={false}
                                        animate={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                      />
                                      <span className="relative z-10">{s.label}</span>
                                    </Link>
                                  </motion.div>
                                </DropdownMenuItem>
                              ))}
                            </motion.div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link
                          href={item.href}
                          aria-current={active ? 'page' : undefined}
                          className={`${getLinkClasses(item)} ${active && item.variant === 'primary' ? 'bg-transparent border-transparent shadow-none' : ''} relative z-10`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </LayoutGroup>
            </nav>
            {/* Contextual subnav */}
            {activeTop && subNavMap[activeTop.key || ''] && (
              <nav className="hidden lg:flex items-center ml-4 space-x-2">
                {subNavMap[activeTop.key || ''].map(s => (
                  <Link key={s.href} href={s.href} className="text-sm text-muted-foreground px-3 py-1 rounded-full hover:bg-muted/60">
                    {s.label}
                  </Link>
                ))}
              </nav>
            )}



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