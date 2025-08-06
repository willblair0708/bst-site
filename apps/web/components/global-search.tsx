"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search,
  File,
  User,
  Bug,
  GitPullRequest,
  BookOpen,
  Settings,
  Clock,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface SearchResult {
  id: string
  type: 'file' | 'issue' | 'pr' | 'person' | 'wiki' | 'commit'
  title: string
  subtitle?: string
  description: string
  url: string
  timestamp?: string
  author?: string
  labels?: string[]
  status?: string
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'file',
    title: 'protocol/main_protocol.yaml',
    description: 'Main protocol file containing study design, endpoints, and inclusion criteria',
    url: '/files/protocol/main_protocol.yaml',
    timestamp: '2024-01-20T14:30:00Z',
    author: 'Dr. Johnson'
  },
  {
    id: '2',
    type: 'issue',
    title: 'Amendment Request: Add biomarker collection protocol',
    subtitle: 'Issue #1',
    description: 'IRB feedback requests addition of optional biomarker collection for exploratory analysis',
    url: '/issues/1',
    timestamp: '2024-01-20T09:00:00Z',
    author: 'Dr. Chen',
    labels: ['amendment', 'biomarkers'],
    status: 'open'
  },
  {
    id: '3',
    type: 'pr',
    title: 'Add Japan sites to protocol',
    subtitle: 'Pull Request #12',
    description: 'Adding 3 additional sites in Japan for Phase II expansion',
    url: '/pull-requests/12',
    timestamp: '2024-01-20T10:00:00Z',
    author: 'Dr. Tanaka',
    labels: ['amendment', 'sites'],
    status: 'open'
  },
  {
    id: '4',
    type: 'person',
    title: 'Dr. Sarah Johnson',
    subtitle: 'Principal Investigator',
    description: 'MD, PhD - Memorial Sloan Kettering - Medical Oncology',
    url: '/people/dr-sarah-johnson',
    timestamp: '2024-01-20T15:30:00Z'
  },
  {
    id: '5',
    type: 'wiki',
    title: 'Eligibility Criteria Guide',
    description: 'Detailed explanation of inclusion and exclusion criteria with clinical examples',
    url: '/wiki/eligibility-criteria',
    timestamp: '2024-01-19T16:45:00Z',
    author: 'Dr. Chen'
  }
]

const getResultIcon = (type: string) => {
  switch (type) {
    case 'file':
      return <File className="w-4 h-4 text-blue-500" />
    case 'issue':
      return <Bug className="w-4 h-4 text-green-500" />
    case 'pr':
      return <GitPullRequest className="w-4 h-4 text-purple-500" />
    case 'person':
      return <User className="w-4 h-4 text-orange-500" />
    case 'wiki':
      return <BookOpen className="w-4 h-4 text-indigo-500" />
    case 'commit':
      return <Zap className="w-4 h-4 text-gray-500" />
    default:
      return <Search className="w-4 h-4 text-gray-500" />
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'file':
      return 'File'
    case 'issue':
      return 'Issue'
    case 'pr':
      return 'Pull Request'
    case 'person':
      return 'Person'
    case 'wiki':
      return 'Wiki'
    case 'commit':
      return 'Commit'
    default:
      return type
  }
}

export function GlobalSearch() {
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // Search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    
    // Simulate API call
    const searchTimer = setTimeout(() => {
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.labels?.some(label => label.toLowerCase().includes(query.toLowerCase()))
      )
      setResults(filtered)
      setLoading(false)
    }, 300)

    return () => clearTimeout(searchTimer)
  }, [query])

  const handleResultClick = (result: SearchResult) => {
    setQuery("")
    setResults([])
    setIsFocused(false)
    // Navigation would be handled by Next.js router
    window.location.href = result.url
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      handleResultClick(results[0])
    }
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pipelines, data, runs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-medium font-light"
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {(isFocused && query && (results.length > 0 || loading)) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover rounded-xl shadow-xl border border-border z-50 max-h-96 overflow-y-auto paper-layers">
          {loading ? (
            <div className="p-4 text-center">
              <div className="w-5 h-5 border-2 border-muted/30 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-muted-foreground text-xs font-light">Searching pipelines...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {results.slice(0, 8).map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full p-3 text-left hover:bg-muted focus:bg-muted focus:outline-none transition-medium"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate text-sm">
                          {result.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {result.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {results.length > 8 && (
                <div className="p-2 text-center text-xs text-gray-500 border-t">
                  +{results.length - 8} more results
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}