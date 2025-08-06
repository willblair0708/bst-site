"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen,
  Plus,
  Search,
  Edit,
  History,
  Users,
  Clock,
  Tag,
  FileText,
  Folder,
  Eye,
  Star,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface WikiPage {
  id: string
  title: string
  slug: string
  content: string
  category: string
  tags: string[]
  author: string
  lastModified: string
  views: number
  bookmarks: number
  isPublic: boolean
}

const wikiPages: WikiPage[] = [
  {
    id: '1',
    title: 'Study Protocol Overview',
    slug: 'protocol-overview',
    content: 'Comprehensive overview of the NSCLC Phase I trial protocol, including objectives, endpoints, and methodology.',
    category: 'Protocol',
    tags: ['protocol', 'overview', 'nsclc'],
    author: 'Dr. Johnson',
    lastModified: '2024-01-20T14:30:00Z',
    views: 89,
    bookmarks: 12,
    isPublic: true
  },
  {
    id: '2',
    title: 'Eligibility Criteria Guide',
    slug: 'eligibility-criteria',
    content: 'Detailed explanation of inclusion and exclusion criteria with clinical examples and edge cases.',
    category: 'Protocol',
    tags: ['eligibility', 'criteria', 'screening'],
    author: 'Dr. Chen',
    lastModified: '2024-01-19T16:45:00Z',
    views: 67,
    bookmarks: 8,
    isPublic: true
  },
  {
    id: '3',
    title: 'Adverse Event Reporting',
    slug: 'ae-reporting',
    content: 'Step-by-step guide for reporting adverse events, including SAE procedures and timelines.',
    category: 'Safety',
    tags: ['safety', 'adverse-events', 'reporting'],
    author: 'Safety Manager',
    lastModified: '2024-01-18T11:20:00Z',
    views: 134,
    bookmarks: 23,
    isPublic: true
  },
  {
    id: '4',
    title: 'Data Entry Best Practices',
    slug: 'data-entry',
    content: 'Guidelines for accurate and consistent data entry in the eCRF system.',
    category: 'Data Management',
    tags: ['data', 'entry', 'ecrf', 'training'],
    author: 'Data Manager',
    lastModified: '2024-01-17T09:15:00Z',
    views: 45,
    bookmarks: 7,
    isPublic: false
  },
  {
    id: '5',
    title: 'Biomarker Collection Protocol',
    slug: 'biomarker-collection',
    content: 'Detailed procedures for optional biomarker sample collection, processing, and storage.',
    category: 'Laboratory',
    tags: ['biomarkers', 'collection', 'laboratory'],
    author: 'Dr. Wilson',
    lastModified: '2024-01-16T13:30:00Z',
    views: 52,
    bookmarks: 9,
    isPublic: true
  },
  {
    id: '6',
    title: 'Regulatory Submissions Timeline',
    slug: 'regulatory-timeline',
    content: 'Key regulatory milestones and submission requirements for the trial.',
    category: 'Regulatory',
    tags: ['regulatory', 'timeline', 'submissions'],
    author: 'Regulatory Team',
    lastModified: '2024-01-15T10:45:00Z',
    views: 78,
    bookmarks: 15,
    isPublic: false
  }
]

const categories = [
  { name: 'All', count: wikiPages.length },
  { name: 'Protocol', count: wikiPages.filter(p => p.category === 'Protocol').length },
  { name: 'Safety', count: wikiPages.filter(p => p.category === 'Safety').length },
  { name: 'Data Management', count: wikiPages.filter(p => p.category === 'Data Management').length },
  { name: 'Laboratory', count: wikiPages.filter(p => p.category === 'Laboratory').length },
  { name: 'Regulatory', count: wikiPages.filter(p => p.category === 'Regulatory').length }
]

const popularTags = ['protocol', 'safety', 'data', 'regulatory', 'biomarkers', 'eligibility']

export default function WikiPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null)

  const filteredPages = wikiPages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || page.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const recentPages = [...wikiPages].sort((a, b) => 
    new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  ).slice(0, 5)

  const popularPages = [...wikiPages].sort((a, b) => b.views - a.views).slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trial Wiki</h1>
          <p className="text-gray-600 mt-1">Documentation and knowledge base for the trial</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <div className="bg-white rounded-lg border p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search wiki..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Categories</h3>
            </div>
            <div className="p-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between hover:bg-gray-50 ${
                    selectedCategory === category.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="w-4 h-4" />
                    <span>{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Popular Tags</h3>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Pages */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Recently Updated</h3>
            </div>
            <div className="divide-y">
              {recentPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className="w-full text-left p-3 hover:bg-gray-50"
                >
                  <div className="font-medium text-sm text-gray-900 truncate">{page.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(page.lastModified)} by {page.author}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedPage ? (
            /* Page View */
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{selectedPage.title}</h1>
                      {selectedPage.isPublic ? (
                        <Badge variant="success">Public</Badge>
                      ) : (
                        <Badge variant="warning">Private</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedPage.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Updated {formatRelativeTime(selectedPage.lastModified)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{selectedPage.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{selectedPage.bookmarks} bookmarks</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4 mr-1" />
                      Bookmark
                    </Button>
                    <Button variant="outline" size="sm">
                      <History className="w-4 h-4 mr-1" />
                      History
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedPage.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose max-w-none">
                  <p>{selectedPage.content}</p>
                  {/* In a real implementation, this would render markdown/rich text */}
                </div>
              </div>
            </div>
          ) : (
            /* Page List */
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl font-bold text-blue-600">{wikiPages.length}</div>
                  <div className="text-sm text-gray-600">Total Pages</div>
                </div>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {wikiPages.filter(p => p.isPublic).length}
                  </div>
                  <div className="text-sm text-gray-600">Public Pages</div>
                </div>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(wikiPages.reduce((sum, p) => sum + p.views, 0) / wikiPages.length)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Views</div>
                </div>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {new Set(wikiPages.map(p => p.author)).size}
                  </div>
                  <div className="text-sm text-gray-600">Contributors</div>
                </div>
              </div>

              {/* Page List */}
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {selectedCategory === 'All' ? 'All Pages' : selectedCategory}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {filteredPages.length} pages
                    </span>
                  </div>
                </div>
                
                <div className="divide-y">
                  {filteredPages.map((page) => (
                    <div 
                      key={page.id} 
                      className="p-6 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedPage(page)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                              {page.title}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {page.category}
                            </Badge>
                            {page.isPublic ? (
                              <Badge variant="success" className="text-xs">Public</Badge>
                            ) : (
                              <Badge variant="warning" className="text-xs">Private</Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {page.content}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{page.author}</span>
                            <span>{formatRelativeTime(page.lastModified)}</span>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{page.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>{page.bookmarks}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {page.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {page.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{page.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}