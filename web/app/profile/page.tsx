"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User,
  MapPin,
  Building,
  Link as LinkIcon,
  Mail,
  Calendar,
  Settings,
  Shield,
  Star,
  GitFork,
  BookOpen,
  Activity,
  Award,
  Users,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface ProfileData {
  username: string
  name: string
  bio: string
  email: string
  location: string
  company: string
  website: string
  joinDate: string
  followers: number
  following: number
  publicTrials: number
  privateTrials: number
  organizations: string[]
  achievements: Achievement[]
  recentActivity: ActivityItem[]
  pinnedTrials: PinnedTrial[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedAt: string
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
}

interface ActivityItem {
  id: string
  type: 'trial_created' | 'protocol_updated' | 'issue_opened' | 'pr_merged' | 'paper_published'
  title: string
  description: string
  timestamp: string
  trial?: string
}

interface PinnedTrial {
  id: string
  name: string
  description: string
  language: string
  stars: number
  forks: number
  isPrivate: boolean
}

const mockProfile: ProfileData = {
  username: "sarah-johnson",
  name: "Dr. Sarah Johnson",
  bio: "Principal Investigator at Memorial Sloan Kettering Cancer Center. Focused on novel immunotherapy approaches for solid tumors. Leading multiple Phase I/II trials.",
  email: "sarah.johnson@mskcc.org",
  location: "New York, NY",
  company: "Memorial Sloan Kettering Cancer Center",
  website: "https://sarahjohnsonmd.com",
  joinDate: "2023-03-15T09:00:00Z",
  followers: 234,
  following: 89,
  publicTrials: 12,
  privateTrials: 8,
  organizations: ["oncology-research", "mskcc", "nci-ctep"],
  achievements: [
    {
      id: "first-trial",
      title: "First Trial",
      description: "Created your first clinical trial",
      icon: "🚀",
      earnedAt: "2023-03-20T10:00:00Z",
      level: "bronze"
    },
    {
      id: "safety-champion",
      title: "Safety Champion",
      description: "Maintained 100% safety compliance across 5+ trials",
      icon: "🛡️",
      earnedAt: "2023-08-15T14:30:00Z",
      level: "gold"
    },
    {
      id: "collaboration-expert",
      title: "Collaboration Expert",
      description: "Contributed to 25+ protocol amendments",
      icon: "🤝",
      earnedAt: "2023-11-20T16:45:00Z",
      level: "silver"
    },
    {
      id: "enrollment-leader",
      title: "Enrollment Leader",
      description: "Achieved 120% enrollment targets",
      icon: "📈",
      earnedAt: "2024-01-10T11:20:00Z",
      level: "platinum"
    }
  ],
  recentActivity: [
    {
      id: "act1",
      type: "protocol_updated",
      title: "Updated protocol for CTP-ABC123",
      description: "Added biomarker collection timepoints",
      timestamp: "2024-01-20T15:30:00Z",
      trial: "CTP-ABC123"
    },
    {
      id: "act2",
      type: "pr_merged",
      title: "Merged pull request #12",
      description: "Add Japan sites to protocol",
      timestamp: "2024-01-19T14:20:00Z",
      trial: "CTP-ABC123"
    },
    {
      id: "act3",
      type: "issue_opened",
      title: "Opened issue #15",
      description: "Amendment request for biomarker collection",
      timestamp: "2024-01-18T11:45:00Z",
      trial: "CTP-ABC123"
    },
    {
      id: "act4",
      type: "paper_published",
      title: "Published paper in Nature Medicine",
      description: "Early results from Phase I immunotherapy trial",
      timestamp: "2024-01-15T09:30:00Z"
    }
  ],
  pinnedTrials: [
    {
      id: "CTP-ABC123",
      name: "NSCLC Phase I Safety Trial",
      description: "Novel immunotherapy approach for advanced NSCLC",
      language: "YAML",
      stars: 23,
      forks: 3,
      isPrivate: false
    },
    {
      id: "CTP-XYZ789",
      name: "CAR-T Optimization Study",
      description: "Next-generation CAR-T cell therapy development",
      language: "YAML",
      stars: 15,
      forks: 2,
      isPrivate: true
    }
  ]
}

const achievementColors = {
  bronze: 'text-orange-600 bg-orange-100',
  silver: 'text-gray-600 bg-gray-100',
  gold: 'text-yellow-600 bg-yellow-100',
  platinum: 'text-purple-600 bg-purple-100'
}

const activityIcons = {
  trial_created: Shield,
  protocol_updated: BookOpen,
  issue_opened: Activity,
  pr_merged: GitFork,
  paper_published: Award
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="p-8">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {mockProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{mockProfile.name}</h1>
                    <p className="text-xl text-gray-600">@{mockProfile.username}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      <User className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 max-w-3xl">{mockProfile.bio}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>{mockProfile.company}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{mockProfile.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4" />
                    <a href={mockProfile.website} className="text-blue-600 hover:underline">
                      {mockProfile.website}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{mockProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(mockProfile.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-6 mt-6 pt-6 border-t">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{mockProfile.followers}</span>
                <span className="text-gray-600">followers</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{mockProfile.following}</span>
                <span className="text-gray-600">following</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{mockProfile.publicTrials}</span>
                <span className="text-gray-600">public trials</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{mockProfile.privateTrials}</span>
                <span className="text-gray-600">private trials</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trials">Trials</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Pinned Trials */}
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-lg font-semibold mb-4">Pinned Trials</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockProfile.pinnedTrials.map((trial) => (
                      <div key={trial.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <Link
                            href={`/${trial.id.toLowerCase()}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {trial.id}
                          </Link>
                          {trial.isPrivate && (
                            <Badge variant="outline" className="text-xs">Private</Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{trial.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{trial.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{trial.language}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{trial.stars}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitFork className="w-3 h-3" />
                            <span>{trial.forks}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-lg font-semibold mb-4">Achievements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockProfile.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                            <Badge className={achievementColors[achievement.level]} variant="outline">
                              {achievement.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Earned {formatRelativeTime(achievement.earnedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trials" className="space-y-6">
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-lg font-semibold mb-4">Public Trials</h2>
                  <p className="text-gray-600">Trial repository listing would go here...</p>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <div className="bg-white rounded-lg border">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                  </div>
                  <div className="divide-y">
                    {mockProfile.recentActivity.map((activity) => {
                      const Icon = activityIcons[activity.type]
                      return (
                        <div key={activity.id} className="p-6 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <Icon className="w-5 h-5 text-gray-400 mt-1" />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{activity.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{formatRelativeTime(activity.timestamp)}</span>
                                {activity.trial && (
                                  <>
                                    <span>in</span>
                                    <Link
                                      href={`/${activity.trial.toLowerCase()}`}
                                      className="text-blue-600 hover:underline"
                                    >
                                      {activity.trial}
                                    </Link>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizations */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Organizations</h3>
              <div className="space-y-3">
                {mockProfile.organizations.map((org) => (
                  <Link
                    key={org}
                    href={`/organizations/${org}`}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600"
                  >
                    <Building className="w-4 h-4" />
                    <span>@{org}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contribution Calendar Placeholder */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contribution Activity</h3>
              <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                <p className="text-gray-500 text-sm">Contribution calendar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}