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
    'text-sm font-semibold rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all duration-200'

  const getLinkClasses = (item: { href: string; variant?: 'primary'; matchPrefixes?: string[] }) => {
    if (item.variant === 'primary') {
      // Soft-UI primary button with Astra-Soft styling
      return `${baseLinkClasses} px-5 py-3 bg-primary-500 text-primary-foreground hover:bg-primary-600 active:translate-y-px soft-ui font-medium tracking-wide`
    }
    const active = isActive(item)
    return [
      baseLinkClasses,
      'px-4 py-2.5',
      active
        ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 font-medium'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent-100/50 dark:hover:bg-accent-900/20',
    ].join(' ')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Enhanced gradient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-primary-50/30 via-primary-100/10 to-transparent dark:from-primary-900/20 dark:via-primary-800/5" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent dark:via-primary-600/30" />
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 h-20">
          {/* Left side - Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl p-3 -m-3">
              <motion.span 
                className="text-2xl font-black tracking-tight bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-primary-400 dark:via-primary-300 dark:to-primary-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Runix
              </motion.span>
              <motion.div
                className="ml-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-accent-400 to-accent-500"
                animate={{ 
                  scale: [1, 1.15, 1], 
                  opacity: [0.8, 1, 0.8],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
              />
            </Link>
          </motion.div>

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
                          className={`absolute inset-0 rounded-xl ${
                            item.variant === 'primary' 
                              ? 'bg-primary-100 dark:bg-primary-900/40' 
                              : 'bg-primary-100 dark:bg-primary-900/30'
                          }`}
                          style={{ zIndex: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        />
                      )}
                      {subs ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.button 
                              aria-current={active ? 'page' : undefined} 
                              className={`${getLinkClasses(item)} ${active && item.variant === 'primary' ? 'bg-transparent' : ''} relative z-10 text-left group`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98, y: 1 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                              <span className="inline-flex items-center gap-2.5">
                                <span>{item.label}</span>
                                <motion.svg 
                                  className="w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" 
                                  viewBox="0 0 20 20" 
                                  fill="none" 
                                  aria-hidden
                                  animate={{ rotate: 0 }}
                                  whileHover={{ y: 0.5 }}
                                >
                                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </motion.svg>
                              </span>
                            </motion.button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            side="bottom" 
                            align="start" 
                            className="rounded-2xl border border-border/30 bg-background/95 backdrop-blur-xl p-3 min-w-[180px] shadow-elevation-2"
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
                                    transition={{ delay: index * 0.04, duration: 0.2, ease: "easeOut" }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98, y: 0.5 }}
                                  >
                                    <Link 
                                      href={s.href} 
                                      className="group relative block w-full px-4 py-3 text-sm text-foreground rounded-xl transition-all duration-200 hover:bg-accent-100/60 dark:hover:bg-accent-900/30 hover:text-accent-foreground font-medium"
                                    >
                                      <span className="relative z-10">{s.label}</span>
                                    </Link>
                                  </motion.div>
                                </DropdownMenuItem>
                              ))}
                            </motion.div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98, y: 1 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          <Link
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className={`${getLinkClasses(item)} ${active && item.variant === 'primary' ? 'bg-transparent' : ''} relative z-10 inline-block`}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
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
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <ThemeToggle />
              </motion.div>

              {/* Notifications */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <NotificationCenter />
              </motion.div>

              {/* User avatar */}
              <motion.div 
                whileHover={{ scale: 1.08, rotate: 2 }} 
                whileTap={{ scale: 0.95 }} 
                transition={{ duration: 0.2, ease: "easeOut" }} 
                className="ml-3"
              >
                <Avatar className="h-11 w-11 border-2 border-primary-200/60 dark:border-primary-800/60 ring-2 ring-primary-100/40 dark:ring-primary-900/30 rounded-2xl">
                  <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-primary-500 to-primary-600 text-primary-foreground rounded-2xl">
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