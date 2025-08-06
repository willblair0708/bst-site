"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, 
  GitFork, 
  Download, 
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  FileText,
  Activity,
  GitBranch,
  Calendar,
  MapPin,
  Target,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TrialPageProps {
  params: Promise<{
    trialId: string
  }>
}

// Mock trial data - in a real app, this would come from an API
const getTrialData = (trialId: string) => {
  const trials = {
    'ctp-covid19': {
      id: "CTP-COVID19",
      title: "COVID-19 Antiviral Phase II/III Efficacy Trial",
      description: "A randomized, double-blind, placebo-controlled phase II/III clinical trial evaluating the efficacy and safety of REV-789 in hospitalized patients with COVID-19.",
      status: "Active",
      phase: "Phase II/III",
      sponsor: "Global Health Research Institute",
      piName: "Dr. Maria Rodriguez, MD, PhD",
      sites: 45,
      enrolled: 1247,
      target: 2500,
      startDate: "2023-06-15",
      estimatedCompletion: "2024-08-31",
      lastUpdated: "2024-01-20T14:30:00Z",
      stars: 156,
      watchers: 324,
      forks: 12,
      indication: "COVID-19",
      drug: {
        name: "REV-789",
        class: "Antiviral",
        mechanism: "RNA polymerase inhibitor"
      }
    },
    'ctp-abc123': {
      id: "CTP-ABC123",
      title: "NSCLC Phase I Safety and Efficacy Trial",
      description: "A multicenter, open-label, dose-escalation phase I clinical trial evaluating the safety, tolerability, pharmacokinetics, and preliminary efficacy of XYZ-789 in patients with advanced non-small cell lung cancer.",
      status: "Active",
      phase: "Phase I",
      sponsor: "Oncology Research Institute",
      piName: "Dr. Sarah Johnson, MD",
      sites: 12,
      enrolled: 24,
      target: 36,
      startDate: "2024-01-15",
      estimatedCompletion: "2024-12-31",
      lastUpdated: "2024-01-20T10:30:00Z",
      stars: 23,
      watchers: 47,
      forks: 3,
      indication: "Non-Small Cell Lung Cancer",
      drug: {
        name: "XYZ-789",
        class: "Targeted Therapy",
        mechanism: "EGFR/ALK Dual Inhibitor"
      }
    }
  }
  
  return trials[trialId as keyof typeof trials] || null
}

const getRecentActivity = (trialId: string) => {
  const activities = {
    'ctp-covid19': [
      {
        type: "commit",
        message: "Update primary endpoint analysis plan",
        author: "Dr. Rodriguez",
        timestamp: "3 hours ago",
        icon: GitBranch
      },
      {
        type: "simulation",
        message: "Generated 500 new synthetic control patients",
        author: "System",
        timestamp: "6 hours ago", 
        icon: BarChart3
      },
      {
        type: "issue",
        message: "Site activation complete: Johns Hopkins",
        author: "Dr. Chen",
        timestamp: "1 day ago",
        icon: CheckCircle2
      }
    ],
    'ctp-abc123': [
      {
        type: "commit",
        message: "Update eligibility criteria for elderly patients",
        author: "Dr. Johnson",
        timestamp: "2 hours ago",
        icon: GitBranch
      },
      {
        type: "simulation",
        message: "Generated 50 new synthetic control twins",
        author: "System",
        timestamp: "4 hours ago", 
        icon: BarChart3
      },
      {
        type: "issue",
        message: "Amendment request: Add biomarker collection",
        author: "Dr. Chen",
        timestamp: "1 day ago",
        icon: AlertCircle
      }
    ]
  }
  
  return activities[trialId as keyof typeof activities] || []
}

const getQuickStats = (trialData: any) => {
  if (trialData.phase === "Phase II/III") {
    return [
      { label: "Protocol Version", value: "v3.2", icon: FileText },
      { label: "Sites Active", value: `${trialData.sites}/${trialData.sites}`, icon: MapPin },
      { label: "Enrollment", value: `${trialData.enrolled}/${trialData.target}`, icon: Users },
      { label: "Efficacy Signal", value: "Promising", icon: Target }
    ]
  } else {
    return [
      { label: "Protocol Version", value: "v2.1", icon: FileText },
      { label: "Sites Active", value: `${trialData.sites}/${trialData.sites}`, icon: MapPin },
      { label: "Enrollment", value: `${trialData.enrolled}/${trialData.target}`, icon: Users },
      { label: "Power Analysis", value: "94.2%", icon: Target }
    ]
  }
}

export default function TrialPage({ params }: TrialPageProps) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const trialData = getTrialData(resolvedParams.trialId)
  const recentActivity = getRecentActivity(resolvedParams.trialId)
  
  if (!trialData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trial Not Found</h1>
          <p className="text-gray-600 mb-6">The trial "{resolvedParams.trialId}" could not be found.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Overview
          </Link>
        </div>
      </div>
    )
  }
  
  const quickStats = getQuickStats(trialData)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Platform Overview
        </Link>
      </div>

      {/* Trial Header */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{trialData.title}</h1>
                <Badge variant={trialData.status === 'Active' ? 'success' : 'secondary'}>
                  {trialData.status}
                </Badge>
                <Badge variant="info">{trialData.phase}</Badge>
              </div>
              <p className="text-gray-600 mb-4">{trialData.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{trialData.stars}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{trialData.watchers}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4" />
                  <span>{trialData.forks}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {new Date(trialData.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 mr-1" />
                Star
              </Button>
              <Button variant="outline" size="sm">
                <GitFork className="w-4 h-4 mr-1" />
                Fork
              </Button>
              <Button size="sm">
                <Download className="w-4 h-4 mr-1" />
                Clone
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Trial Status</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <Icon className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* README */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">README.md</h2>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
            <div className="p-6 prose max-w-none">
              <h3>Study Overview</h3>
              <p>
                {trialData.description}
              </p>
              
              <h3>Drug Information</h3>
              <ul>
                <li><strong>Name:</strong> {trialData.drug.name}</li>
                <li><strong>Class:</strong> {trialData.drug.class}</li>
                <li><strong>Mechanism:</strong> {trialData.drug.mechanism}</li>
              </ul>

              <h3>Quick Links</h3>
              <p>
                <Link href={`/${resolvedParams.trialId}/files/protocol`} className="text-blue-600 hover:underline">Protocol</Link> • 
                <Link href={`/${resolvedParams.trialId}/files/consent`} className="text-blue-600 hover:underline ml-1">Informed Consent</Link> • 
                <Link href={`/${resolvedParams.trialId}/analytics`} className="text-blue-600 hover:underline ml-1">Analytics Dashboard</Link>
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="divide-y">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.author} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trial Info */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Trial Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Study ID</span>
                <span className="font-medium">{trialData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Indication</span>
                <span className="font-medium">{trialData.indication}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sponsor</span>
                <span className="font-medium">{trialData.sponsor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Principal Investigator</span>
                <span className="font-medium">{trialData.piName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date</span>
                <span className="font-medium">{new Date(trialData.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Completion</span>
                <span className="font-medium">{new Date(trialData.estimatedCompletion).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href={`/${resolvedParams.trialId}/issues/new`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Create Amendment
                </Button>
              </Link>
              <Link href={`/${resolvedParams.trialId}/analytics`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Run Simulation
                </Button>
              </Link>
              <Link href={`/${resolvedParams.trialId}/files`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              </Link>
              <Link href={`/${resolvedParams.trialId}/people`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Team
                </Button>
              </Link>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">IRB Approval</span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">FDA IND</span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">GCP Training</span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Site Activations</span>
                <Badge variant="success">{trialData.sites}/{trialData.sites}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}