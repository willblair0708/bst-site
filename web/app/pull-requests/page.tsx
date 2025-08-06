"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  GitPullRequest,
  GitMerge,
  X,
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  MessageSquare,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Code,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface PullRequest {
  id: number
  title: string
  status: 'open' | 'merged' | 'closed'
  author: string
  assignee?: string
  reviewers: string[]
  createdAt: string
  updatedAt: string
  description: string
  commits: number
  comments: number
  additions: number
  deletions: number
  files: number
  labels: string[]
  branch: {
    from: string
    to: string
  }
  checks: {
    validation: 'pending' | 'success' | 'failure'
    simulation: 'pending' | 'success' | 'failure'
    compliance: 'pending' | 'success' | 'failure'
  }
}

const pullRequests: PullRequest[] = [
  {
    id: 12,
    title: "Add Japan sites to protocol",
    status: "open",
    author: "Dr. Tanaka",
    assignee: "Dr. Johnson",
    reviewers: ["Dr. Chen", "Regulatory Team"],
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
    description: "Adding 3 additional sites in Japan for Phase II expansion. Includes updated protocol, informed consent translations, and regulatory documentation.",
    commits: 3,
    comments: 8,
    additions: 247,
    deletions: 12,
    files: 6,
    labels: ["amendment", "sites", "international"],
    branch: { from: "feature/japan-sites", to: "main" },
    checks: {
      validation: "success",
      simulation: "pending",
      compliance: "success"
    }
  },
  {
    id: 11,
    title: "Update eligibility criteria for elderly patients",
    status: "merged",
    author: "Dr. Johnson",
    reviewers: ["Dr. Martinez", "Dr. Wilson"],
    createdAt: "2024-01-18T09:00:00Z",
    updatedAt: "2024-01-19T14:22:00Z",
    description: "Lowering minimum age from 18 to 16 based on IRB feedback. Updated inclusion/exclusion criteria and informed consent.",
    commits: 2,
    comments: 12,
    additions: 89,
    deletions: 23,
    files: 4,
    labels: ["protocol", "eligibility", "irb-feedback"],
    branch: { from: "feature/age-criteria", to: "main" },
    checks: {
      validation: "success",
      simulation: "success",
      compliance: "success"
    }
  },
  {
    id: 10,
    title: "Implement FDA meeting feedback on endpoints",
    status: "open",
    author: "Dr. Martinez",
    assignee: "Dr. Johnson",
    reviewers: ["Dr. Chen", "Biostatistician"],
    createdAt: "2024-01-17T11:30:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
    description: "Major protocol amendments based on Type B meeting with FDA. Updates primary and secondary endpoint definitions, statistical analysis plan.",
    commits: 8,
    comments: 24,
    additions: 456,
    deletions: 189,
    files: 12,
    labels: ["fda", "endpoints", "major-amendment"],
    branch: { from: "feature/fda-feedback", to: "main" },
    checks: {
      validation: "failure",
      simulation: "pending",
      compliance: "pending"
    }
  },
  {
    id: 9,
    title: "Add biomarker collection protocol",
    status: "open",
    author: "Dr. Wilson",
    assignee: "Dr. Chen",
    reviewers: ["Dr. Johnson"],
    createdAt: "2024-01-16T14:45:00Z",
    updatedAt: "2024-01-19T16:20:00Z",
    description: "Optional biomarker collection for exploratory analysis. Includes new procedures, informed consent updates, and laboratory manual.",
    commits: 5,
    comments: 16,
    additions: 324,
    deletions: 45,
    files: 8,
    labels: ["biomarkers", "exploratory", "optional"],
    branch: { from: "feature/biomarkers", to: "main" },
    checks: {
      validation: "success",
      simulation: "success",
      compliance: "pending"
    }
  },
  {
    id: 8,
    title: "Update synthetic twin parameters",
    status: "closed",
    author: "Biostatistician",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-16T10:30:00Z",
    description: "Adjust synthetic twin generation parameters based on latest real-world data analysis.",
    commits: 3,
    comments: 7,
    additions: 67,
    deletions: 34,
    files: 3,
    labels: ["synthetic-twins", "parameters"],
    branch: { from: "feature/twin-params", to: "main" },
    checks: {
      validation: "success",
      simulation: "success",
      compliance: "success"
    }
  }
]

const statusColors = {
  open: 'text-green-600 bg-green-100',
  merged: 'text-purple-600 bg-purple-100',
  closed: 'text-gray-600 bg-gray-100'
}

const checkStatusColors = {
  pending: 'text-yellow-600',
  success: 'text-green-600',
  failure: 'text-red-600'
}

export default function PullRequestsPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'merged' | 'closed'>('open')
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPRs = pullRequests.filter(pr => {
    const matchesFilter = filter === 'all' || pr.status === filter
    const matchesSearch = pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pr.labels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const openCount = pullRequests.filter(pr => pr.status === 'open').length
  const mergedCount = pullRequests.filter(pr => pr.status === 'merged').length
  const closedCount = pullRequests.filter(pr => pr.status === 'closed').length

  const getStatusIcon = (status: PullRequest['status']) => {
    switch (status) {
      case 'open':
        return <GitPullRequest className="w-5 h-5 text-green-500" />
      case 'merged':
        return <GitMerge className="w-5 h-5 text-purple-500" />
      case 'closed':
        return <X className="w-5 h-5 text-red-500" />
    }
  }

  const getCheckIcon = (status: 'pending' | 'success' | 'failure') => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'failure':
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pull Requests</h1>
          <p className="text-gray-600 mt-1">Collaborate on protocol changes and amendments</p>
        </div>
        <Link href="/pull-requests/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Pull Request
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
                  All ({pullRequests.length})
                </Button>
                <Button
                  variant={filter === 'open' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('open')}
                  className="flex items-center space-x-1"
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>Open ({openCount})</span>
                </Button>
                <Button
                  variant={filter === 'merged' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('merged')}
                  className="flex items-center space-x-1"
                >
                  <GitMerge className="w-4 h-4" />
                  <span>Merged ({mergedCount})</span>
                </Button>
                <Button
                  variant={filter === 'closed' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('closed')}
                  className="flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Closed ({closedCount})</span>
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pull requests..."
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
            </div>
          </div>
        </div>

        {/* Pull Request List */}
        <div className="divide-y">
          {filteredPRs.map((pr) => (
            <div key={pr.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(pr.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Link 
                      href={`/pull-requests/${pr.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      {pr.title}
                    </Link>
                    <Badge className={statusColors[pr.status]}>
                      {pr.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{pr.description}</p>

                  {/* Branch Info */}
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Code className="w-4 h-4" />
                    <span>{pr.branch.from}</span>
                    <span>→</span>
                    <span className="font-medium">{pr.branch.to}</span>
                  </div>

                  {/* Checks */}
                  <div className="flex items-center space-x-4 text-sm mb-2">
                    <div className="flex items-center space-x-1">
                      {getCheckIcon(pr.checks.validation)}
                      <span className={checkStatusColors[pr.checks.validation]}>
                        Validation
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getCheckIcon(pr.checks.simulation)}
                      <span className={checkStatusColors[pr.checks.simulation]}>
                        Simulation
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getCheckIcon(pr.checks.compliance)}
                      <span className={checkStatusColors[pr.checks.compliance]}>
                        Compliance
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>#{pr.id}</span>
                    <span>opened {formatRelativeTime(pr.createdAt)} by {pr.author}</span>
                    {pr.assignee && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>assigned to {pr.assignee}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <GitCommit className="w-4 h-4" />
                      <span>{pr.commits} commits</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{pr.comments}</span>
                    </div>
                    <div className="text-green-600">+{pr.additions}</div>
                    <div className="text-red-600">-{pr.deletions}</div>
                  </div>

                  {/* Reviewers */}
                  {pr.reviewers.length > 0 && (
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>Review requested from {pr.reviewers.join(', ')}</span>
                    </div>
                  )}
                  
                  {pr.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {pr.labels.map((label) => (
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
            <GitPullRequest className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">Protocol Changes</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Propose and review changes to trial protocols with automated validation.
          </p>
          <Link href="/pull-requests/new?type=protocol">
            <Button variant="outline" size="sm" className="w-full">
              Create Protocol PR →
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3 mb-4">
            <GitMerge className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Amendment Workflow</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Submit amendments through collaborative review process with regulatory checks.
          </p>
          <Link href="/pull-requests/new?type=amendment">
            <Button variant="outline" size="sm" className="w-full">
              Create Amendment PR →
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Automated Checks</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            All PRs include validation, simulation runs, and compliance verification.
          </p>
          <Link href="/actions">
            <Button variant="outline" size="sm" className="w-full">
              View Checks →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}