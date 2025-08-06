"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users,
  UserPlus,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Download
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface Patient {
  id: string
  screeningNumber: string
  site: string
  investigator: string
  enrolledDate: string
  status: 'screened' | 'enrolled' | 'completed' | 'withdrawn'
  cohort?: string
  doseLevel?: string
  demographics: {
    age: number
    gender: 'M' | 'F'
    ethnicity: string
  }
}

interface SiteEnrollment {
  site: string
  investigator: string
  target: number
  enrolled: number
  screening: number
  rate: number
  trend: 'up' | 'down' | 'stable'
  lastEnrollment?: string
  status: 'ahead' | 'on-track' | 'behind' | 'delayed'
}

const mockPatients: Patient[] = [
  {
    id: 'CTP-024',
    screeningNumber: 'SCR-089',
    site: 'Memorial Sloan Kettering',
    investigator: 'Dr. Johnson',
    enrolledDate: '2024-01-20T14:30:00Z',
    status: 'enrolled',
    cohort: 'Cohort 3',
    doseLevel: '80mg',
    demographics: { age: 62, gender: 'F', ethnicity: 'White' }
  },
  {
    id: 'CTP-023',
    screeningNumber: 'SCR-088',
    site: 'Johns Hopkins',
    investigator: 'Dr. Chen',
    enrolledDate: '2024-01-19T16:45:00Z',
    status: 'enrolled',
    cohort: 'Cohort 3',
    doseLevel: '80mg',
    demographics: { age: 58, gender: 'M', ethnicity: 'Asian' }
  },
  {
    id: 'CTP-022',
    screeningNumber: 'SCR-087',
    site: 'MD Anderson',
    investigator: 'Dr. Martinez',
    enrolledDate: '2024-01-18T11:20:00Z',
    status: 'enrolled',
    cohort: 'Cohort 2',
    doseLevel: '60mg',
    demographics: { age: 69, gender: 'M', ethnicity: 'Hispanic' }
  },
  {
    id: 'CTP-021',
    screeningNumber: 'SCR-086',
    site: 'Mayo Clinic',
    investigator: 'Dr. Wilson',
    enrolledDate: '2024-01-17T09:15:00Z',
    status: 'completed',
    cohort: 'Cohort 2',
    doseLevel: '60mg',
    demographics: { age: 54, gender: 'F', ethnicity: 'White' }
  }
]

const siteEnrollment: SiteEnrollment[] = [
  {
    site: 'Memorial Sloan Kettering',
    investigator: 'Dr. Johnson',
    target: 6,
    enrolled: 8,
    screening: 2,
    rate: 133,
    trend: 'up',
    lastEnrollment: '2024-01-20T14:30:00Z',
    status: 'ahead'
  },
  {
    site: 'Johns Hopkins',
    investigator: 'Dr. Chen',
    target: 6,
    enrolled: 5,
    screening: 3,
    rate: 83,
    trend: 'stable',
    lastEnrollment: '2024-01-19T16:45:00Z',
    status: 'on-track'
  },
  {
    site: 'MD Anderson',
    investigator: 'Dr. Martinez',
    target: 6,
    enrolled: 4,
    screening: 1,
    rate: 67,
    trend: 'down',
    lastEnrollment: '2024-01-18T11:20:00Z',
    status: 'behind'
  },
  {
    site: 'Mayo Clinic',
    investigator: 'Dr. Wilson',
    target: 6,
    enrolled: 7,
    screening: 4,
    rate: 117,
    trend: 'up',
    lastEnrollment: '2024-01-17T09:15:00Z',
    status: 'ahead'
  },
  {
    site: 'Dana-Farber',
    investigator: 'Dr. Davis',
    target: 6,
    enrolled: 0,
    screening: 0,
    rate: 0,
    trend: 'stable',
    status: 'delayed'
  }
]

const enrollmentTargets = {
  total: 36,
  current: 24,
  monthly: 6,
  projected: 34
}

const statusColors = {
  'screened': 'text-blue-600 bg-blue-100',
  'enrolled': 'text-green-600 bg-green-100',
  'completed': 'text-purple-600 bg-purple-100',
  'withdrawn': 'text-red-600 bg-red-100'
}

const siteStatusColors = {
  'ahead': 'text-green-600 bg-green-100',
  'on-track': 'text-blue-600 bg-blue-100',
  'behind': 'text-orange-600 bg-orange-100',
  'delayed': 'text-red-600 bg-red-100'
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-green-500" />
    case 'down':
      return <TrendingDown className="w-4 h-4 text-red-500" />
    default:
      return <Clock className="w-4 h-4 text-gray-500" />
  }
}

const getSiteStatusIcon = (status: string) => {
  switch (status) {
    case 'ahead':
    case 'on-track':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />
    case 'behind':
      return <Clock className="w-4 h-4 text-orange-500" />
    case 'delayed':
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    default:
      return <Clock className="w-4 h-4 text-gray-500" />
  }
}

export function EnrollmentTracker() {
  const [viewMode, setViewMode] = useState<'overview' | 'sites' | 'patients'>('overview')

  const enrollmentRate = Math.round((enrollmentTargets.current / enrollmentTargets.total) * 100)
  const projectedRate = Math.round((enrollmentTargets.projected / enrollmentTargets.total) * 100)

  return (
    <div className="space-y-6">
      {/* Enrollment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">{enrollmentTargets.current}</div>
              <div className="text-sm text-gray-600">Enrolled</div>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${enrollmentRate}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {enrollmentRate}% of target ({enrollmentTargets.total})
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">{enrollmentTargets.projected}</div>
              <div className="text-sm text-gray-600">Projected</div>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${projectedRate}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {projectedRate}% projected completion
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">{enrollmentTargets.monthly}</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Average: 4.2/month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-600">5</div>
              <div className="text-sm text-gray-600">Active Sites</div>
            </div>
            <MapPin className="w-8 h-8 text-orange-500" />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            12 total sites
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <Button
                variant={viewMode === 'overview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('overview')}
              >
                Overview
              </Button>
              <Button
                variant={viewMode === 'sites' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('sites')}
              >
                Sites
              </Button>
              <Button
                variant={viewMode === 'patients' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('patients')}
              >
                Patients
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-1" />
                Enroll Patient
              </Button>
            </div>
          </div>
        </div>

        {/* Sites View */}
        {viewMode === 'sites' && (
          <div className="divide-y">
            {siteEnrollment.map((site, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getSiteStatusIcon(site.status)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{site.site}</div>
                      <div className="text-sm text-gray-600">{site.investigator}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-lg font-medium text-gray-900">
                        {site.enrolled}/{site.target}
                      </div>
                      <div className="text-xs text-gray-500">Enrolled</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-medium text-blue-600">{site.screening}</div>
                      <div className="text-xs text-gray-500">Screening</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-medium text-gray-900">{site.rate}%</span>
                        {getTrendIcon(site.trend)}
                      </div>
                      <div className="text-xs text-gray-500">Rate</div>
                    </div>
                    
                    <div className="text-center min-w-[100px]">
                      <Badge className={siteStatusColors[site.status]}>
                        {site.status}
                      </Badge>
                    </div>
                    
                    {site.lastEnrollment && (
                      <div className="text-center">
                        <div className="text-sm text-gray-600">
                          {formatRelativeTime(site.lastEnrollment)}
                        </div>
                        <div className="text-xs text-gray-500">Last enrollment</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Patients View */}
        {viewMode === 'patients' && (
          <div className="divide-y">
            {mockPatients.map((patient) => (
              <div key={patient.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {patient.id.split('-')[1]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {patient.id} ({patient.screeningNumber})
                      </div>
                      <div className="text-sm text-gray-600">
                        {patient.site} • {patient.investigator}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <Badge className={statusColors[patient.status]}>
                        {patient.status}
                      </Badge>
                    </div>
                    
                    {patient.cohort && (
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{patient.cohort}</div>
                        <div className="text-xs text-gray-500">{patient.doseLevel}</div>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-900">
                        {patient.demographics.age}y {patient.demographics.gender}
                      </div>
                      <div className="text-xs text-gray-500">{patient.demographics.ethnicity}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600">
                        {formatRelativeTime(patient.enrolledDate)}
                      </div>
                      <div className="text-xs text-gray-500">Enrolled</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overview Charts (placeholder) */}
        {viewMode === 'overview' && (
          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Enrollment timeline chart would be displayed here</p>
                <p className="text-sm">Shows enrollment progress over time by site</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}