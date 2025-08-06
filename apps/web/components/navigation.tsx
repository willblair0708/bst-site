"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { GlobalSearch } from '@/components/global-search'
import { NotificationCenter } from '@/components/notifications'
import { 
  BookOpen,
  Bug,
  Code,
  FileText,
  GitPullRequest,
  Home,
  BarChart3,
  Settings,
  Shield,
  Users,
  FolderOpen,
  Target,
  Activity,
  Zap
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}

const navigation: NavItem[] = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Files', href: '/files', icon: FolderOpen },
  { name: 'Issues', href: '/issues', icon: Bug, count: 7 },
  { name: 'Pull Requests', href: '/pull-requests', icon: GitPullRequest, count: 3 },
  { name: 'Actions', href: '/actions', icon: Zap },
  { name: 'Projects', href: '/projects', icon: Target, count: 2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Wiki', href: '/wiki', icon: BookOpen },
  { name: 'People', href: '/people', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <span className="text-xl font-bold">Bastion</span>
                <span className="text-sm text-gray-500 block">CTP-ABC123</span>
              </div>
            </div>
            <div className="hidden md:block">
              <Badge variant="info">Phase I</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <GlobalSearch />
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="w-4 h-4 text-green-500" />
              <span>Active</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>12 investigators</span>
            </div>
            <NotificationCenter />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-8 overflow-x-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-1 py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap",
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
                {item.count && (
                  <Badge variant="secondary" className="ml-1">
                    {item.count}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}