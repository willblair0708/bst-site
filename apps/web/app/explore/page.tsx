"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield,
  Star,
  GitFork,
  TrendingUp,
  Users,
  Activity,
  Calendar,
  Search,
  Filter,
  Building,
  Globe,
  Clock,
  Award,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

const trendingTrials = [
  {
    id: "CTP-COVID19",
    name: "COVID-19 Vaccine Efficacy Study", 
    owner: "infectious-disease-network",
    description: "Large-scale randomized controlled trial evaluating next-generation COVID-19 vaccine candidates",
    stars: 156,
    forks: 23,
    language: "YAML",
    topics: ["covid-19", "vaccine", "infectious-disease"],
    updatedAt: "2024-01-20T10:30:00Z"
  },
  {
    id: "CTP-ALZHM",
    name: "Alzheimer Disease Prevention Study",
    owner: "neuroscience-institute", 
    description: "Multi-year longitudinal study examining early intervention strategies for preventing cognitive decline",
    stars: 89,
    forks: 12,
    language: "YAML", 
    topics: ["alzheimer", "prevention", "neuroscience"],
    updatedAt: "2024-01-19T14:20:00Z"
  },
  {
    id: "CTP-HEART",
    name: "Heart Failure Digital Health Trial",
    owner: "cardiology-collective",
    description: "Evaluating digital therapeutics and remote monitoring for heart failure management",
    stars: 67,
    forks: 8,
    language: "YAML",
    topics: ["heart-failure", "digital-health", "remote-monitoring"],
    updatedAt: "2024-01-18T16:45:00Z"
  }
]

const featuredOrganizations = [
  {
    name: "oncology-research",
    displayName: "Oncology Research Institute",
    description: "Leading academic medical center focused on cancer research",
    members: 156,
    publicTrials: 23,
    verified: true
  },
  {
    name: "pediatric-oncology", 
    displayName: "Children's Oncology Group",
    description: "World's largest organization devoted to childhood cancer research",
    members: 234,
    publicTrials: 18,
    verified: true
  },
  {
    name: "neuroscience-institute",
    displayName: "Global Neuroscience Institute",
    description: "Advancing understanding and treatment of neurological disorders",
    members: 78,
    publicTrials: 12,
    verified: true
  }
]

const topContributors = [
  {
    username: "sarah-johnson",
    name: "Dr. Sarah Johnson",
    organization: "Memorial Sloan Kettering",
    contributions: 245,
    specialties: ["Oncology", "Immunotherapy"]
  },
  {
    username: "michael-chen",
    name: "Dr. Michael Chen", 
    organization: "Johns Hopkins",
    contributions: 189,
    specialties: ["Pulmonology", "Critical Care"]
  },
  {
    username: "lisa-martinez",
    name: "Dr. Lisa Martinez",
    organization: "MD Anderson",
    contributions: 167,
    specialties: ["Medical Oncology", "Clinical Research"]
  }
]

const collections = [
  {
    name: "Cancer Immunotherapy Trials",
    description: "Curated collection of cutting-edge immunotherapy clinical trials",
    trials: 24,
    curator: "oncology-research",
    updatedAt: "2024-01-19T12:00:00Z"
  },
  {
    name: "Pediatric Rare Disease Studies",
    description: "Clinical trials focusing on rare diseases in pediatric populations",
    trials: 18,
    curator: "pediatric-oncology",
    updatedAt: "2024-01-18T09:30:00Z"
  },
  {
    name: "Digital Health Interventions",
    description: "Trials evaluating digital therapeutics and health technologies", 
    trials: 31,
    curator: "digital-health-consortium",
    updatedAt: "2024-01-17T15:45:00Z"
  }
]

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("trending")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Explore Clinical Trials</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover cutting-edge clinical research, collaborate with leading investigators, 
              and contribute to advancing medical science.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/trials">
                <Button variant="secondary" size="lg">
                  Browse All Trials
                </Button>
              </Link>
              <Link href="/new/trial">
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Start a Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            {/* Trending Trials */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold">Trending trials this week</h2>
                </div>
              </div>
              <div className="divide-y">
                {trendingTrials.map((trial, index) => (
                  <div key={trial.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Link
                            href={`/${trial.id.toLowerCase()}`}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            {trial.owner}/{trial.id}
                          </Link>
                          <Badge variant="outline" className="text-xs">Public</Badge>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{trial.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{trial.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {trial.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                          <span>Updated {formatRelativeTime(trial.updatedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4 mr-1" />
                          Star
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold">Featured organizations</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {featuredOrganizations.map((org) => (
                  <div key={org.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
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
                    <p className="text-gray-600 text-sm mb-4">{org.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{org.members} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4" />
                        <span>{org.publicTrials} trials</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contributors" className="space-y-6">
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold">Top contributors</h2>
                </div>
              </div>
              <div className="divide-y">
                {topContributors.map((contributor, index) => (
                  <div key={contributor.username} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {contributor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/profile/${contributor.username}`}
                            className="font-semibold text-gray-900 hover:text-blue-600"
                          >
                            {contributor.name}
                          </Link>
                          <span className="text-gray-500">@{contributor.username}</span>
                        </div>
                        <p className="text-sm text-gray-600">{contributor.organization}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {contributor.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{contributor.contributions}</div>
                        <div className="text-sm text-gray-500">contributions</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <h2 className="text-lg font-semibold">Curated collections</h2>
                </div>
              </div>
              <div className="divide-y">
                {collections.map((collection, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{collection.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{collection.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Shield className="w-4 h-4" />
                            <span>{collection.trials} trials</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>Curated by {collection.curator}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Updated {formatRelativeTime(collection.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Collection
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}