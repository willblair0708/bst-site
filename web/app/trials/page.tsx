"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield,
  Plus,
  Search,
  Filter,
  Star,
  GitFork,
  Lock,
  Globe,
  Calendar,
  Users,
  Activity,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface Trial {
  id: string
  name: string
  description: string
  owner: string
  isPrivate: boolean
  phase: string
  status: 'Active' | 'Completed' | 'On Hold' | 'Planning'
  language: string
  stars: number
  forks: number
  watchers: number
  lastUpdated: string
  topics: string[]
  investigators: number
  enrollment: {
    current: number
    target: number
  }
}

const mockTrials: Trial[] = [
  {
    id: 'CTP-ABC123',
    name: 'NSCLC Phase I Safety and Efficacy Trial',
    description: 'A multicenter, open-label, dose-escalation phase I clinical trial evaluating the safety, tolerability, pharmacokinetics, and preliminary efficacy of XYZ-789.',
    owner: 'oncology-research',
    isPrivate: false,
    phase: 'Phase I',
    status: 'Active',
    language: 'YAML',
    stars: 23,
    forks: 3,
    watchers: 47,
    lastUpdated: '2024-01-20T15:30:00Z',
    topics: ['nsclc', 'oncology', 'phase-i', 'immunotherapy'],
    investigators: 12,
    enrollment: { current: 24, target: 36 }
  },
  {
    id: 'CTP-DEF456',
    name: 'Breast Cancer Phase II Combination Study',
    description: 'Randomized, double-blind, placebo-controlled phase II study of combination therapy in HER2-positive breast cancer patients.',
    owner: 'breast-cancer-consortium',
    isPrivate: true,
    phase: 'Phase II',
    status: 'Active',
    language: 'YAML',
    stars: 15,
    forks: 1,
    watchers: 28,
    lastUpdated: '2024-01-18T09:45:00Z',
    topics: ['breast-cancer', 'her2-positive', 'combination-therapy'],
    investigators: 8,
    enrollment: { current: 67, target: 120 }
  },
  {
    id: 'CTP-GHI789',
    name: 'Pediatric Oncology Phase I/II Trial',
    description: 'First-in-pediatric patients phase I/II trial of novel targeted therapy for relapsed/refractory solid tumors.',
    owner: 'pediatric-oncology',
    isPrivate: false,
    phase: 'Phase I/II',
    status: 'Active',
    language: 'YAML',
    stars: 8,
    forks: 2,
    watchers: 19,
    lastUpdated: '2024-01-15T14:20:00Z',
    topics: ['pediatric', 'solid-tumors', 'targeted-therapy'],
    investigators: 6,
    enrollment: { current: 12, target: 24 }
  },
  {
    id: 'CTP-JKL012',
    name: 'Alzheimer Disease Prevention Study',
    description: 'Multi-year longitudinal study examining early intervention strategies for preventing cognitive decline in at-risk populations.',
    owner: 'neuroscience-institute',
    isPrivate: false,
    phase: 'Phase III',
    status: 'Completed',
    language: 'YAML',
    stars: 45,
    forks: 7,
    watchers: 89,
    lastUpdated: '2024-01-10T11:30:00Z',
    topics: ['alzheimer', 'prevention', 'neuroscience', 'longitudinal'],
    investigators: 25,
    enrollment: { current: 500, target: 500 }
  },
  {
    id: 'CTP-MNO345',
    name: 'COVID-19 Vaccine Efficacy Study',
    description: 'Large-scale randomized controlled trial evaluating next-generation COVID-19 vaccine candidates in diverse populations.',
    owner: 'infectious-disease-network',
    isPrivate: false,
    phase: 'Phase III',
    status: 'On Hold',
    language: 'YAML',
    stars: 156,
    forks: 23,
    watchers: 234,
    lastUpdated: '2024-01-05T16:15:00Z',
    topics: ['covid-19', 'vaccine', 'infectious-disease', 'public-health'],
    investigators: 45,
    enrollment: { current: 2340, target: 5000 }
  }
]

const statusColors = {
  'Active': 'text-green-600 bg-green-100',
  'Completed': 'text-blue-600 bg-blue-100',
  'On Hold': 'text-yellow-600 bg-yellow-100',
  'Planning': 'text-purple-600 bg-purple-100'
}

const phaseColors = {
  'Phase I': 'text-orange-600 bg-orange-100',
  'Phase II': 'text-blue-600 bg-blue-100',
  'Phase III': 'text-green-600 bg-green-100',
  'Phase I/II': 'text-purple-600 bg-purple-100'
}

export default function TrialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterOwner, setFilterOwner] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('updated')

  const filteredTrials = mockTrials.filter(trial => {
    const matchesSearch = trial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trial.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || trial.status === filterStatus
    const matchesOwner = filterOwner === 'all' || trial.owner === filterOwner
    return matchesSearch && matchesStatus && matchesOwner
  })

  const sortedTrials = [...filteredTrials].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'stars':
        return b.stars - a.stars
      case 'updated':
      default:
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    }
  })

  const uniqueOwners = Array.from(new Set(mockTrials.map(t => t.owner)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clinical Trials</h1>
              <p className="text-gray-600 mt-2">Discover and collaborate on clinical research</p>
            </div>
            <Link href="/new/trial">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Find trials</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Advanced filters
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search trials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border rounded-md"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Planning">Planning</option>
            </select>
            
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Organizations</option>
              {uniqueOwners.map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="updated">Recently updated</option>
              <option value="name">Name</option>
              <option value="stars">Most stars</option>
            </select>
          </div>
        </div>

        {/* Trials List */}
        <div className="space-y-4">
          {sortedTrials.map((trial) => (
            <div key={trial.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-1">
                      {trial.isPrivate ? (
                        <Lock className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Globe className="w-4 h-4 text-gray-400" />
                      )}
                      <Link
                        href={`/${trial.id.toLowerCase()}`}
                        className="text-blue-600 hover:underline font-semibold text-lg"
                      >
                        {trial.owner}/{trial.id}
                      </Link>
                    </div>
                    {trial.isPrivate && (
                      <Badge variant="outline" className="text-xs">Private</Badge>
                    )}
                    <Badge className={phaseColors[trial.phase]} variant="outline">
                      {trial.phase}
                    </Badge>
                    <Badge className={statusColors[trial.status]} variant="outline">
                      <Activity className="w-3 h-3 mr-1" />
                      {trial.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{trial.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{trial.description}</p>
                  
                  {/* Topics */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {trial.topics.slice(0, 4).map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {trial.topics.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{trial.topics.length - 4}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{trial.language}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{trial.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="w-4 h-4" />
                      <span>{trial.forks}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{trial.investigators} investigators</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{trial.enrollment.current}/{trial.enrollment.target} enrolled</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {formatRelativeTime(trial.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4 mr-1" />
                    Star
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {sortedTrials.length === 0 && (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trials found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or create a new trial.
            </p>
            <Link href="/new/trial">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create your first trial
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}