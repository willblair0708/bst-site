"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building,
  Plus,
  Search,
  MapPin,
  Users,
  Shield,
  Globe,
  Calendar,
  Star,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface Organization {
  id: string
  name: string
  displayName: string
  description: string
  website?: string
  location: string
  type: 'Academic' | 'Pharmaceutical' | 'CRO' | 'Government' | 'Non-profit'
  size: 'Small' | 'Medium' | 'Large' | 'Enterprise'
  members: number
  publicTrials: number
  totalTrials: number
  createdAt: string
  avatar?: string
  verified: boolean
  specialties: string[]
}

const mockOrganizations: Organization[] = [
  {
    id: 'oncology-research',
    name: 'oncology-research',
    displayName: 'Oncology Research Institute',
    description: 'Leading academic medical center focused on cancer research and innovative treatment development.',
    website: 'https://oncology-research.org',
    location: 'New York, NY',
    type: 'Academic',
    size: 'Large',
    members: 156,
    publicTrials: 23,
    totalTrials: 45,
    createdAt: '2023-03-15T09:00:00Z',
    verified: true,
    specialties: ['Oncology', 'Immunotherapy', 'Targeted Therapy', 'CAR-T']
  },
  {
    id: 'breast-cancer-consortium',
    name: 'breast-cancer-consortium',
    displayName: 'International Breast Cancer Consortium',
    description: 'Global collaborative network of researchers and clinicians dedicated to advancing breast cancer treatment.',
    website: 'https://ibcc.org',
    location: 'Boston, MA',
    type: 'Non-profit',
    size: 'Enterprise',
    members: 89,
    publicTrials: 15,
    totalTrials: 28,
    createdAt: '2023-01-20T14:30:00Z',
    verified: true,
    specialties: ['Breast Cancer', 'HER2', 'Triple Negative', 'Hormone Therapy']
  },
  {
    id: 'pediatric-oncology',
    name: 'pediatric-oncology',
    displayName: 'Children\'s Oncology Group',
    description: 'The world\'s largest organization devoted exclusively to childhood and adolescent cancer research.',
    website: 'https://childrensoncologygroup.org',
    location: 'Philadelphia, PA',
    type: 'Academic',
    size: 'Large',
    members: 234,
    publicTrials: 18,
    totalTrials: 67,
    createdAt: '2022-11-10T11:15:00Z',
    verified: true,
    specialties: ['Pediatric Oncology', 'Leukemia', 'Brain Tumors', 'Solid Tumors']
  },
  {
    id: 'neuroscience-institute',
    name: 'neuroscience-institute',
    displayName: 'Global Neuroscience Institute',
    description: 'Multidisciplinary research institute advancing understanding and treatment of neurological disorders.',
    website: 'https://neuroscience-institute.org',
    location: 'San Francisco, CA',
    type: 'Academic',
    size: 'Medium',
    members: 78,
    publicTrials: 12,
    totalTrials: 34,
    createdAt: '2023-06-05T16:45:00Z',
    verified: true,
    specialties: ['Neuroscience', 'Alzheimer', 'Parkinson', 'ALS']
  },
  {
    id: 'pharma-innovations',
    name: 'pharma-innovations',
    displayName: 'Pharma Innovations Ltd',
    description: 'Biopharmaceutical company developing next-generation therapeutics for rare diseases.',
    website: 'https://pharmainnovations.com',
    location: 'Cambridge, UK',
    type: 'Pharmaceutical',
    size: 'Medium',
    members: 45,
    publicTrials: 8,
    totalTrials: 23,
    createdAt: '2023-08-12T08:30:00Z',
    verified: false,
    specialties: ['Rare Diseases', 'Gene Therapy', 'Orphan Drugs']
  }
]

const typeColors = {
  'Academic': 'text-blue-600 bg-blue-100',
  'Pharmaceutical': 'text-green-600 bg-green-100',
  'CRO': 'text-purple-600 bg-purple-100',
  'Government': 'text-orange-600 bg-orange-100',
  'Non-profit': 'text-red-600 bg-red-100'
}

const sizeColors = {
  'Small': 'text-gray-600 bg-gray-100',
  'Medium': 'text-blue-600 bg-blue-100',
  'Large': 'text-green-600 bg-green-100',
  'Enterprise': 'text-purple-600 bg-purple-100'
}

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('members')

  const filteredOrganizations = mockOrganizations.filter(org => {
    const matchesSearch = org.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === 'all' || org.type === filterType
    return matchesSearch && matchesType
  })

  const sortedOrganizations = [...filteredOrganizations].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.displayName.localeCompare(b.displayName)
      case 'trials':
        return b.publicTrials - a.publicTrials
      case 'members':
      default:
        return b.members - a.members
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
              <p className="text-gray-600 mt-2">Research institutions and companies conducting clinical trials</p>
            </div>
            <Link href="/new/organization">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Organization
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Find organizations</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border rounded-md"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="Academic">Academic</option>
              <option value="Pharmaceutical">Pharmaceutical</option>
              <option value="CRO">CRO</option>
              <option value="Government">Government</option>
              <option value="Non-profit">Non-profit</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="members">Most members</option>
              <option value="trials">Most trials</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOrganizations.map((org) => (
            <div key={org.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {org.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/organizations/${org.name}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {org.displayName}
                      </Link>
                      {org.verified && (
                        <Shield className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">@{org.name}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{org.description}</p>

              <div className="flex items-center space-x-2 mb-4">
                <Badge className={typeColors[org.type]} variant="outline">
                  {org.type}
                </Badge>
                <Badge className={sizeColors[org.size]} variant="outline">
                  {org.size}
                </Badge>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1 mb-4">
                {org.specialties.slice(0, 3).map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {org.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{org.specialties.length - 3}
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center space-x-1 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{org.members} members</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>{org.publicTrials} public trials</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{org.location}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatRelativeTime(org.createdAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Link
                  href={`/organizations/${org.name}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View organization →
                </Link>
                {org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {sortedOrganizations.length === 0 && (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or create a new organization.
            </p>
            <Link href="/new/organization">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create organization
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}