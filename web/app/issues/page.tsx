"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Tag,
  Calendar,
  User,
  Clock,
  FileText,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface Issue {
  id: number
  title: string
  status: 'open' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'amendment' | 'regulatory' | 'protocol' | 'data' | 'safety'
  author: string
  assignee?: string
  createdAt: string
  comments: number
  labels: string[]
  description: string
}

const issues: Issue[] = [
  {
    id: 1,
    title: "Amendment Request: Add biomarker collection protocol",
    status: "open",
    priority: "high",
    type: "amendment",
    author: "Dr. Chen",
    assignee: "Dr. Johnson",
    createdAt: "2024-01-20T09:00:00Z",
    comments: 5,
    labels: ["amendment", "biomarkers", "protocol-change"],
    description: "IRB feedback requests addition of optional biomarker collection for exploratory analysis"
  },
  {
    id: 2,
    title: "Regulatory: FDA meeting feedback implementation",
    status: "open",
    priority: "critical",
    type: "regulatory",
    author: "Dr. Martinez",
    assignee: "Dr. Johnson",
    createdAt: "2024-01-19T14:30:00Z",
    comments: 12,
    labels: ["fda", "regulatory", "meeting-feedback"],
    description: "Implement changes from Type B meeting with FDA regarding primary endpoint definition"
  },
  {
    id: 3,
    title: "Data discrepancy in patient demographics",
    status: "open",
    priority: "medium",
    type: "data",
    author: "Dr. Wilson",
    assignee: "Data Manager",
    createdAt: "2024-01-18T11:15:00Z",
    comments: 3,
    labels: ["data-quality", "demographics"],
    description: "Age calculation inconsistency found in 3 patient records"
  },
  {
    id: 4,
    title: "Update consent form language for clarity",
    status: "closed",
    priority: "medium",
    type: "protocol",
    author: "Dr. Johnson",
    createdAt: "2024-01-17T16:20:00Z",
    comments: 8,
    labels: ["consent", "protocol", "completed"],
    description: "Simplify language in informed consent per community advisory board feedback"
  },
  {
    id: 5,
    title: "SAE report submission delay",
    status: "open",
    priority: "critical",
    type: "safety",
    author: "Safety Manager",
    assignee: "Dr. Johnson",
    createdAt: "2024-01-16T13:45:00Z",
    comments: 7,
    labels: ["safety", "sae", "urgent"],
    description: "Expedited SAE report due to FDA within 24 hours"
  },
  {
    id: 6,
    title: "Add Japan sites to multi-regional protocol",
    status: "open",
    priority: "low",
    type: "amendment",
    author: "Dr. Tanaka",
    assignee: "Regulatory Team",
    createdAt: "2024-01-15T10:30:00Z",
    comments: 4,
    labels: ["amendment", "sites", "international"],
    description: "Request to add 3 sites in Japan for global expansion"
  },
  {
    id: 7,
    title: "Synthetic twin validation results review",
    status: "closed",
    priority: "medium",
    type: "data",
    author: "Biostatistician",
    createdAt: "2024-01-14T08:00:00Z",
    comments: 6,
    labels: ["synthetic-twins", "validation", "completed"],
    description: "Review validation metrics for latest synthetic twin generation"
  }
]

const priorityColors = {
  low: 'text-gray-600 bg-gray-100',
  medium: 'text-blue-600 bg-blue-100',
  high: 'text-orange-600 bg-orange-100',
  critical: 'text-red-600 bg-red-100'
}

const typeColors = {
  amendment: 'text-purple-600 bg-purple-100',
  regulatory: 'text-red-600 bg-red-100',
  protocol: 'text-blue-600 bg-blue-100',
  data: 'text-green-600 bg-green-100',
  safety: 'text-orange-600 bg-orange-100'
}

export default function IssuesPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open')
  const [searchQuery, setSearchQuery] = useState("")

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.status === filter
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.labels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const openCount = issues.filter(i => i.status === 'open').length
  const closedCount = issues.filter(i => i.status === 'closed').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
          <p className="text-gray-600 mt-1">Track amendments, regulatory feedback, and trial management</p>
        </div>
        <Link href="/issues/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Issue
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Status Filter */}
              <div className="flex items-center space-x-1">
                <Button
                  variant={filter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({issues.length})
                </Button>
                <Button
                  variant={filter === 'open' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('open')}
                  className="flex items-center space-x-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Open ({openCount})</span>
                </Button>
                <Button
                  variant={filter === 'closed' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('closed')}
                  className="flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Closed ({closedCount})</span>
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border rounded-md text-sm w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Tag className="w-4 h-4 mr-1" />
                Labels
              </Button>
            </div>
          </div>
        </div>

        {/* Issue List */}
        <div className="divide-y">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {issue.status === 'open' ? (
                    <AlertCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Link 
                      href={`/issues/${issue.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      {issue.title}
                    </Link>
                    <Badge className={priorityColors[issue.priority]}>
                      {issue.priority}
                    </Badge>
                    <Badge className={typeColors[issue.type]}>
                      {issue.type}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{issue.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>#{issue.id}</span>
                    <span>opened {formatRelativeTime(issue.createdAt)} by {issue.author}</span>
                    {issue.assignee && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>assigned to {issue.assignee}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{issue.comments}</span>
                    </div>
                  </div>
                  
                  {issue.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {issue.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Protocol Amendments</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Submit and track protocol amendments through regulatory approval process.
          </p>
          <Link href="/issues/new?type=amendment">
            <Button variant="outline" size="sm" className="w-full">
              Create Amendment →
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold">Safety Reports</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Report and track safety events, SAEs, and regulatory notifications.
          </p>
          <Link href="/issues/new?type=safety">
            <Button variant="outline" size="sm" className="w-full">
              Report Safety Event →
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Data Issues</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Report data discrepancies, query resolution, and quality issues.
          </p>
          <Link href="/issues/new?type=data">
            <Button variant="outline" size="sm" className="w-full">
              Report Data Issue →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}