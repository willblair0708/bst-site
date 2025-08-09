"use client"

import React from 'react'
import { motion, LayoutGroup, useReducedMotion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { usePathname } from 'next/navigation'
import { GlobalSearch } from '@/components/global-search'
import { NotificationCenter } from '@/components/notifications'
import { ThemeToggle } from '@/components/theme-toggle'
import { MOTION, EASING } from '@/lib/motion/tokens'
import { cn } from '@/lib/utils'



// Types
type NavItem = {
  href: string
  key?: string
  label: string
  variant?: 'primary'
  matchPrefixes?: string[]
}

type SubNav = Record<string, { href: string; label: string }[]>

type PillarTheme = {
  bgPastel: string
  text: string
  ring: string
  gradientFrom: string
}

// Navigation model
const NAV_ITEMS: NavItem[] = [
  { href: '/explore', key: 'explore', label: 'Explore', variant: 'primary', matchPrefixes: ['/explore', '/repos', '/models', '/datasets', '/workflows', '/templates'] },
  { href: '/runs', key: 'runs', label: 'Run', matchPrefixes: ['/ide?repo=demo', '/runs', '/testbeds'] },
  { href: '/dashboard', key: 'dashboard', label: 'Dashboard', matchPrefixes: ['/dashboard'] },
  { href: '/docs', key: 'docs', label: 'Docs', matchPrefixes: ['/docs'] },
  { href: '/policy', key: 'policy', label: 'Policy', matchPrefixes: ['/policy'] },
  { href: '/community', key: 'community', label: 'Community', matchPrefixes: ['/community'] },
  { href: '/mission', key: 'mission', label: 'Mission', matchPrefixes: ['/mission'] },
]

const SUB_NAV_MAP: SubNav = {
  explore: [
    { href: '/explore', label: 'All' },
    { href: '/repos', label: 'Repositories' },
    { href: '/models', label: 'Models' },
    { href: '/datasets', label: 'Datasets' },
    { href: '/workflows', label: 'Workflows' },
    { href: '/templates', label: 'Templates' },
  ],
  runs: [
    { href: '/ide?repo=demo', label: 'IDE' },
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

// Pillar theming per @design.mdc (Astra-Soft v0.5)
const PILLAR_THEMES: Record<string, PillarTheme> = {
  explore: {
    bgPastel: 'bg-primary-100',
    text: 'text-primary-600',
    ring: 'ring-primary-500',
    gradientFrom: 'from-primary-100',
  },
  runs: {
    bgPastel: 'bg-accent-100',
    text: 'text-accent-500',
    ring: 'ring-accent-500',
    gradientFrom: 'from-accent-100',
  },
  community: {
    bgPastel: 'bg-collaboration-100',
    text: 'text-collaboration-500',
    ring: 'ring-[hsl(var(--viz-purple))]',
    gradientFrom: 'from-collaboration-100',
  },
  dashboard: {
    bgPastel: 'bg-primary-100',
    text: 'text-primary-600',
    ring: 'ring-primary-500',
    gradientFrom: 'from-primary-100',
  },
  docs: {
    bgPastel: 'bg-primary-100',
    text: 'text-primary-600',
    ring: 'ring-primary-500',
    gradientFrom: 'from-primary-100',
  },
  policy: {
    bgPastel: 'bg-primary-100',
    text: 'text-primary-600',
    ring: 'ring-primary-500',
    gradientFrom: 'from-primary-100',
  },
  mission: {
    bgPastel: 'bg-collaboration-100',
    text: 'text-collaboration-500',
    ring: 'ring-[hsl(var(--viz-purple))]',
    gradientFrom: 'from-collaboration-100',
  },
  default: {
    bgPastel: 'bg-primary-100',
    text: 'text-primary-600',
    ring: 'ring-primary-500',
    gradientFrom: 'from-primary-100',
  },
}

// Styling constants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: -8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: EASING.smooth
      }
    }
  }
}

const STYLES = {
  navLink: {
    base: 'relative text-sm font-medium rounded-xl px-4 py-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
    active: 'text-primary-600 dark:text-primary-400 bg-primary-100/80 dark:bg-primary-900/40',
    inactive: 'text-muted-foreground hover:text-foreground hover:bg-accent/40',
    primary: 'px-5 py-3 bg-primary-500 text-primary-foreground hover:bg-primary-600 font-semibold'
  },
  subNavLink: 'text-sm px-3 py-1.5 rounded-lg transition-all duration-200 relative',
  dropdown: 'rounded-2xl border border-border/30 bg-background/95 backdrop-blur-xl p-2 min-w-[180px] shadow-lg'
}

// Helper Components
const Logo = () => (
  <motion.div 
    className="flex items-center"
    variants={ANIMATION_VARIANTS.item}
  >
    <Link 
      href="/" 
      className="group flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl p-2 -m-2 transition-all duration-200"
    >
      <span className="text-2xl text-foreground font-bold tracking-tight">
        Runix
      </span>
      <div className="ml-2.5 w-2.5 h-2.5 rounded-full bg-primary transition-all duration-200 group-hover:scale-110" />
    </Link>
  </motion.div>
)

const SearchBar = () => (
  <motion.div 
    className="flex items-center justify-center w-full"
    variants={ANIMATION_VARIANTS.item}
  >
    <div className="w-full">
      <GlobalSearch />
    </div>
  </motion.div>
)

const NavLink = ({ item, isActive, subs }: { item: NavItem; isActive: boolean; subs?: { href: string; label: string }[] }) => {
  const prefersReducedMotion = useReducedMotion()
  
  const linkClass = cn(
    STYLES.navLink.base,
    item.variant === 'primary' && STYLES.navLink.primary,
    isActive ? STYLES.navLink.active : STYLES.navLink.inactive
  )

  if (subs) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button 
            className={linkClass}
            whileHover={!prefersReducedMotion ? { y: -1 } : undefined}
            whileTap={!prefersReducedMotion ? { y: 0 } : undefined}
          >
            <span className="flex items-center gap-2">
              {item.label}
              <motion.svg 
                className="w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" 
                viewBox="0 0 20 20" 
                fill="none"
              >
                <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </span>
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={STYLES.dropdown}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: EASING.swift }}
          >
            {subs.map((sub, index) => (
              <DropdownMenuItem key={sub.href} asChild className="p-0">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                >
                  <Link 
                    href={sub.href} 
                    className="block w-full px-3 py-2 text-sm rounded-xl hover:bg-accent/50 transition-colors duration-200"
                  >
                    {sub.label}
                  </Link>
                </motion.div>
              </DropdownMenuItem>
            ))}
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <motion.div
      whileHover={!prefersReducedMotion ? { y: -1 } : undefined}
      whileTap={!prefersReducedMotion ? { y: 0 } : undefined}
    >
      <Link href={item.href} className={linkClass}>
        {item.label}
      </Link>
    </motion.div>
  )
}

const SubNavigation = ({ activeItem, pathname }: { activeItem: NavItem; pathname: string }) => {
  const subs = SUB_NAV_MAP[activeItem.key || '']
  if (!subs) return null

  // Only show sub-navigation on main section pages, not on specific sub-pages
  const isOnMainSectionPage = pathname === activeItem.href
  const isOnSubPage = subs.some(sub => pathname === sub.href)
  
  // Don't show sub-nav if we're on a specific sub-page
  if (isOnSubPage && !isOnMainSectionPage) return null

  return (
    <AnimatePresence>
      <motion.nav 
        className="hidden lg:flex items-center ml-6 space-x-1"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2, ease: EASING.smooth }}
      >
        {subs.map((sub, index) => {
          const isSubActive = pathname === sub.href
          return (
            <motion.div
              key={sub.href}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
            >
              <Link 
                href={sub.href} 
                className={cn(
                  STYLES.subNavLink,
                  isSubActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                )}
              >
                {sub.label}
              </Link>
            </motion.div>
          )
        })}
      </motion.nav>
    </AnimatePresence>
  )
}

const MobileNavButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    onClick={onClick}
    variants={ANIMATION_VARIANTS.item}
    whileTap={{ scale: 0.95 }}
    aria-label="Toggle mobile menu"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  </motion.button>
)

const UserActions = ({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) => (
  <motion.div 
    className="flex items-center space-x-3"
    variants={ANIMATION_VARIANTS.container}
  >
    {onMobileMenuToggle && (
      <MobileNavButton onClick={onMobileMenuToggle} />
    )}
    <motion.div variants={ANIMATION_VARIANTS.item} className="hidden sm:block">
      <ThemeToggle />
    </motion.div>
    <motion.div variants={ANIMATION_VARIANTS.item}>
      <NotificationCenter />
    </motion.div>
  </motion.div>
)

export function GitHubHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const isActive = (item: NavItem) => {
    if (!pathname) return false
    const prefixes = item.matchPrefixes ?? [item.href]
    return prefixes.some((p) => pathname.startsWith(p))
  }

  const activeItem = NAV_ITEMS.find(isActive)
  const activePillar = PILLAR_THEMES[activeItem?.key || 'default']

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      {/* Subtle accent tint based on active section */}
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 opacity-60 bg-gradient-to-b',
          activePillar.gradientFrom,
          'to-transparent dark:opacity-20'
        )}
      />
      
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex items-center justify-between h-16 gap-4 lg:gap-6"
          variants={ANIMATION_VARIANTS.container}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden sm:flex flex-1 max-w-2xl lg:max-w-3xl">
            <SearchBar />
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Primary Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Primary">
              <LayoutGroup id="nav">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item)
                  const subs = item.key ? SUB_NAV_MAP[item.key] : undefined
                  
                  return (
                    <motion.div 
                      key={item.key || item.href}
                      className="relative"
                      variants={ANIMATION_VARIANTS.item}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-primary/10 rounded-xl"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <NavLink item={item} isActive={active} subs={subs} />
                    </motion.div>
                  )
                })}
              </LayoutGroup>
            </nav>

            {/* Sub Navigation */}
            {activeItem && pathname && (
              <SubNavigation activeItem={activeItem} pathname={pathname} />
            )}

            {/* User Actions */}
            <UserActions onMobileMenuToggle={handleMobileMenuToggle} />
          </div>
        </motion.div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="sm:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASING.smooth }}
            >
              <div className="p-4 space-y-4">
                <GlobalSearch />
                <nav className="space-y-2" aria-label="Mobile navigation">
                  {NAV_ITEMS.map((item) => {
                    const active = isActive(item)
                    return (
                      <Link
                        key={item.key || item.href}
                        href={item.href}
                        className={cn(
                          'block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200',
                          active 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}