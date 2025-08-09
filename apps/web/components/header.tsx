"use client"

import React from 'react'
import { motion, LayoutGroup, useReducedMotion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { usePathname } from 'next/navigation'
import { GlobalSearch } from '@/components/global-search'
import { NotificationCenter } from '@/components/notifications'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MOTION, EASING } from '@/lib/motion/tokens'



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
  const prefersReducedMotion = useReducedMotion()

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
      {/* Enhanced background */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-primary-50/20 dark:bg-primary-900/10" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-px bg-primary-300/30 dark:bg-primary-600/20" />
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 h-20">
          {/* Left side - Logo */}
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASING.smooth }}
          >
            <Link href="/" className="group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl p-3 -m-3">
              <span className="text-2xl text-foreground font-bold tracking-tight">
                Runix
              </span>
              <div className="ml-2.5 w-2.5 h-2.5 rounded-full bg-primary" />
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
                <motion.div 
                  className="flex items-center space-x-2"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2
                      }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {navItems.map((item, index) => {
                    const active = isActive(item)
                    const subs = item.key ? subNavMap[item.key] : undefined
                    return (
                      <motion.div 
                        key={item.key || item.href} 
                        className="relative"
                        variants={{
                          hidden: { opacity: 0, y: -10 },
                          visible: { 
                            opacity: 1, 
                            y: 0,
                            transition: {
                              delay: index * 0.05,
                              duration: 0.3,
                              ease: EASING.smooth
                            }
                          }
                        }}
                      >
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
                        
                        {/* Enhanced hover background effect */}
                        <motion.div
                          className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
                          initial={{ 
                            backgroundColor: "hsl(var(--primary) / 0.05)",
                            opacity: 0
                          }}
                          whileHover={!prefersReducedMotion && !active ? {
                            opacity: 1,
                            backgroundColor: "hsl(var(--primary) / 0.12)"
                          } : undefined}
                          transition={{ duration: 0.3, ease: EASING.smooth }}
                        />
                        
                        {subs ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <motion.button 
                                aria-current={active ? 'page' : undefined} 
                                className={`${getLinkClasses(item)} ${active && item.variant === 'primary' ? 'bg-transparent' : ''} relative z-10 text-left group overflow-hidden`}
                                initial={{ 
                                  color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
                                }}
                                whileHover={!prefersReducedMotion ? {
                                  color: active ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                                  textShadow: active ? "0 0 8px hsl(var(--primary) / 0.3)" : "0 0 4px hsl(var(--foreground) / 0.2)"
                                } : undefined}
                                whileTap={!prefersReducedMotion ? { y: 1 } : undefined}
                                transition={{ duration: 0.2, ease: EASING.swift }}
                              >
                                <span className="inline-flex items-center gap-2.5 relative z-10">
                                  <span>{item.label}</span>
                                  <motion.svg 
                                    className="w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" 
                                    viewBox="0 0 20 20" 
                                    fill="none" 
                                    aria-hidden
                                    initial={{ rotate: 0, y: 0 }}
                                    whileHover={!prefersReducedMotion ? { 
                                      y: 0.5
                                    } : undefined}
                                    transition={{ duration: 0.2, ease: EASING.swift }}
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
                                initial={{ opacity: 0, y: -10, backdropFilter: "blur(0px)" }}
                                animate={{ opacity: 1, y: 0, backdropFilter: "blur(12px)" }}
                                exit={{ opacity: 0, y: -10, backdropFilter: "blur(0px)" }}
                                transition={{ duration: 0.2, ease: EASING.swift }}
                              >
                                {subs.map((s, subIndex) => (
                                  <DropdownMenuItem asChild key={s.href} className="p-0">
                                    <motion.div
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: subIndex * 0.04, duration: 0.2, ease: EASING.smooth }}
                                      className="relative overflow-hidden rounded-xl"
                                    >
                                      <motion.div
                                        className="absolute inset-0 opacity-0 pointer-events-none"
                                        initial={{ 
                                          backgroundColor: "hsl(var(--primary) / 0.1)",
                                          opacity: 0,
                                          x: "-100%"
                                        }}
                                        whileHover={!prefersReducedMotion ? {
                                          opacity: 1,
                                          x: "0%",
                                          backgroundColor: "hsl(var(--primary) / 0.15)"
                                        } : undefined}
                                        transition={{ duration: 0.3, ease: EASING.swift }}
                                      />
                                      <Link 
                                        href={s.href} 
                                        className="group relative block w-full px-4 py-3 text-sm text-foreground rounded-xl transition-all duration-200 font-medium"
                                      >
                                        <motion.span 
                                          className="relative z-10"
                                          initial={{ color: "hsl(var(--foreground))" }}
                                          whileHover={!prefersReducedMotion ? {
                                            color: "hsl(var(--primary))",
                                            x: 2
                                          } : undefined}
                                          transition={{ duration: 0.2, ease: EASING.swift }}
                                        >
                                          {s.label}
                                        </motion.span>
                                      </Link>
                                    </motion.div>
                                  </DropdownMenuItem>
                                ))}
                              </motion.div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <motion.div
                            className="relative overflow-hidden rounded-xl"
                            whileTap={!prefersReducedMotion ? { y: 1 } : undefined}
                            transition={{ duration: 0.15, ease: EASING.swift }}
                          >
                            <Link
                              href={item.href}
                              aria-current={active ? 'page' : undefined}
                              className={`${getLinkClasses(item)} ${active && item.variant === 'primary' ? 'bg-transparent' : ''} relative z-10 inline-block`}
                            >
                              <motion.span
                                initial={{ 
                                  color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
                                }}
                                whileHover={!prefersReducedMotion ? {
                                  color: active ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                                  textShadow: active ? "0 0 8px hsl(var(--primary) / 0.3)" : "0 0 4px hsl(var(--foreground) / 0.2)"
                                } : undefined}
                                transition={{ duration: 0.2, ease: EASING.swift }}
                              >
                                {item.label}
                              </motion.span>
                            </Link>
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </motion.div>
              </LayoutGroup>
            </nav>
            {/* Contextual subnav */}
            <AnimatePresence>
              {activeTop && subNavMap[activeTop.key || ''] && (
                <motion.nav 
                  className="hidden lg:flex items-center ml-4 space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: EASING.smooth }}
                >
                  {subNavMap[activeTop.key || ''].map((s, index) => {
                    const isSubActive = pathname === s.href
                    return (
                      <motion.div
                        key={s.href}
                        className="relative"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2, ease: EASING.smooth }}
                      >
                        <motion.div
                          className="absolute inset-0 rounded-full opacity-0 pointer-events-none"
                          initial={{ 
                            backgroundColor: "hsl(var(--primary) / 0.1)",
                            opacity: 0,
                            scaleX: 0.5
                          }}
                          whileHover={!prefersReducedMotion ? {
                            opacity: 1,
                            scaleX: 1,
                            backgroundColor: "hsl(var(--primary) / 0.15)"
                          } : undefined}
                          transition={{ duration: 0.25, ease: EASING.swift }}
                        />
                        <Link 
                          href={s.href} 
                          className={`relative z-10 text-sm px-3 py-1 rounded-full transition-all duration-200 ${
                            isSubActive 
                              ? 'text-primary-600 dark:text-primary-400 bg-primary-100/50 dark:bg-primary-900/30' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <motion.span
                            initial={{ color: isSubActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
                            whileHover={!prefersReducedMotion && !isSubActive ? {
                              color: "hsl(var(--foreground))"
                            } : undefined}
                            transition={{ duration: 0.2, ease: EASING.swift }}
                          >
                            {s.label}
                          </motion.span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </motion.nav>
              )}
            </AnimatePresence>



            {/* User Actions */}
            <motion.div 
              className="flex items-center space-x-3"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.4
                  }
                }
              }}
              initial="hidden"
              animate="visible"
            >
              {/* Theme toggle */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <ThemeToggle />
              </motion.div>

              {/* Notifications */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <NotificationCenter />
              </motion.div>

              {/* User avatar */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Avatar className="h-8 w-8 ring-1 ring-border hover:ring-2 hover:ring-primary/20 transition-all duration-200">
                  <AvatarFallback className="text-xs font-medium bg-muted">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </motion.div>


          </div>
        </div>
      </div>
    </header>
  )
}