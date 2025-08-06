"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen,
  Bug,
  Code,
  FileText,
  GitPullRequest,
  Home,
  BarChart3,
  Settings,
  Users,
  FolderOpen,
  Target,
  Activity,
  Zap,
  Star,
  Eye,
  GitFork,
  Bell,
  Shield,
  Clock
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

const trialInfo = {
  id: "CTP-ABC123",
  title: "NSCLC Phase I Safety and Efficacy Trial", 
  phase: "Phase I",
  status: "Active",
  owner: "oncology-research",
  isPrivate: false,
  stars: 23,
  watching: 47,
  forks: 3,
  lastUpdated: "2024-01-20T10:30:00Z"
}

export function TrialNavigation() {
  const pathname = usePathname()

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trial Header */}
        <div className="flex items-center justify-between py-4 border-b">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <div className="flex items-center space-x-2">
                  <Link href="/organizations/oncology-research" className="text-blue-600 hover:underline">
                    {trialInfo.owner}
                  </Link>
                  <span className="text-gray-500">/</span>
                  <Link href="/" className="text-blue-600 hover:underline font-semibold">
                    {trialInfo.id}
                  </Link>
                  {trialInfo.isPrivate && (
                    <Badge variant="outline" className="text-xs">Private</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{trialInfo.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="info" className="text-xs">{trialInfo.phase}</Badge>
              <Badge 
                variant={trialInfo.status === 'Active' ? 'success' : 'secondary'} 
                className="text-xs"
              >
                <Activity className="w-3 h-3 mr-1" />
                {trialInfo.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Trial Actions */}
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" className="text-xs">
                <Bell className="w-3 h-3 mr-1" />
                Notifications
                <Badge variant="secondary" className="ml-1 text-xs">
                  {trialInfo.watching}
                </Badge>
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                Star
                <Badge variant="secondary" className="ml-1 text-xs">
                  {trialInfo.stars}
                </Badge>
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <GitFork className="w-3 h-3 mr-1" />
                Fork
                <Badge variant="secondary" className="ml-1 text-xs">
                  {trialInfo.forks}
                </Badge>
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-8 overflow-x-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-1 py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap",
                  isActive
                    ? "border-orange-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
                {item.count && (
                  <Badge variant="secondary" className="ml-1 text-xs">
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