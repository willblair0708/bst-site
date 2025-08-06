"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Users,
  FileText,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface SafetyEvent {
  id: string
  type: 'AE' | 'SAE' | 'DLT' | 'SUSAR'
  severity: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5'
  event: string
  patient: string
  site: string
  investigator: string
  reportedAt: string
  status: 'reported' | 'under_review' | 'resolved' | 'requires_action'
  relationship: 'unrelated' | 'unlikely' | 'possible' | 'probable' | 'definite'
  outcome: string
  action_required: boolean
  regulatory_notification: boolean
  notification_deadline?: string
}

interface SafetyMetrics {
  totalAEs: number
  totalSAEs: number
  dltRate: number
  dropoutRate: number
  trends: {
    aes: 'up' | 'down' | 'stable'
    saes: 'up' | 'down' | 'stable'
    dlts: 'up' | 'down' | 'stable'
  }
}

const mockSafetyEvents: SafetyEvent[] = [
  {
    id: 'SE-001',
    type: 'SAE',
    severity: 'Grade 3',
    event: 'Neutropenia',
    patient: 'CTP-019',
    site: 'Memorial Sloan Kettering',
    investigator: 'Dr. Johnson',
    reportedAt: '2024-01-20T16:30:00Z',
    status: 'requires_action',
    relationship: 'probable',
    outcome: 'Ongoing',
    action_required: true,
    regulatory_notification: true,
    notification_deadline: '2024-01-21T16:30:00Z'
  },
  {
    id: 'SE-002',
    type: 'AE',
    severity: 'Grade 2',
    event: 'Fatigue',
    patient: 'CTP-018',
    site: 'Johns Hopkins',
    investigator: 'Dr. Chen',
    reportedAt: '2024-01-20T14:15:00Z',
    status: 'under_review',
    relationship: 'possible',
    outcome: 'Resolved',
    action_required: false,
    regulatory_notification: false
  },
  {
    id: 'SE-003',
    type: 'AE',
    severity: 'Grade 1',
    event: 'Nausea',
    patient: 'CTP-020',
    site: 'MD Anderson',
    investigator: 'Dr. Martinez',
    reportedAt: '2024-01-20T11:45:00Z',
    status: 'resolved',
    relationship: 'possible',
    outcome: 'Resolved with treatment',
    action_required: false,
    regulatory_notification: false
  }
]

const safetyMetrics: SafetyMetrics = {
  totalAEs: 47,
  totalSAEs: 3,
  dltRate: 8.3,
  dropoutRate: 12.5,
  trends: {
    aes: 'stable',
    saes: 'up',
    dlts: 'stable'
  }
}

const severityColors = {
  'Grade 1': 'text-green-600 bg-green-100',
  'Grade 2': 'text-yellow-600 bg-yellow-100',
  'Grade 3': 'text-orange-600 bg-orange-100',
  'Grade 4': 'text-red-600 bg-red-100',
  'Grade 5': 'text-purple-600 bg-purple-100'
}

const statusColors = {
  'reported': 'text-blue-600 bg-blue-100',
  'under_review': 'text-yellow-600 bg-yellow-100',
  'resolved': 'text-green-600 bg-green-100',
  'requires_action': 'text-red-600 bg-red-100'
}

const typeColors = {
  'AE': 'text-blue-600 bg-blue-100',
  'SAE': 'text-red-600 bg-red-100',
  'DLT': 'text-purple-600 bg-purple-100',
  'SUSAR': 'text-orange-600 bg-orange-100'
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-red-500" />
    case 'down':
      return <TrendingDown className="w-4 h-4 text-green-500" />
    default:
      return <Minus className="w-4 h-4 text-gray-500" />
  }
}

export function SafetyMonitor() {
  const [selectedEvent, setSelectedEvent] = useState<SafetyEvent | null>(null)

  const urgentEvents = mockSafetyEvents.filter(e => 
    e.action_required || e.regulatory_notification
  )

  const handleEventClick = (event: SafetyEvent) => {
    setSelectedEvent(event)
  }

  const handleNotifyRegulatory = (eventId: string) => {
    console.log('Notifying regulatory for event:', eventId)
  }

  const handleEscalate = (eventId: string) => {
    console.log('Escalating event:', eventId)
  }

  return (
    <div className="space-y-6">
      {/* Safety Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{safetyMetrics.totalAEs}</div>
              <div className="text-sm text-gray-600">Total AEs</div>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon(safetyMetrics.trends.aes)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">{safetyMetrics.totalSAEs}</div>
              <div className="text-sm text-gray-600">Total SAEs</div>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon(safetyMetrics.trends.saes)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-600">{safetyMetrics.dltRate}%</div>
              <div className="text-sm text-gray-600">DLT Rate</div>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon(safetyMetrics.trends.dlts)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">{safetyMetrics.dropoutRate}%</div>
              <div className="text-sm text-gray-600">Dropout Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Alerts */}
      {urgentEvents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-800">Urgent Safety Actions Required</h2>
            <Badge variant="destructive">{urgentEvents.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {urgentEvents.map((event) => (
              <div key={event.id} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={typeColors[event.type]}>{event.type}</Badge>
                      <Badge className={severityColors[event.severity]}>{event.severity}</Badge>
                      <span className="font-medium">{event.event}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Patient: {event.patient} • Site: {event.site}</div>
                      <div>Investigator: {event.investigator}</div>
                      <div>Reported: {formatRelativeTime(event.reportedAt)}</div>
                      {event.notification_deadline && (
                        <div className="text-red-600 font-medium">
                          Regulatory notification due: {new Date(event.notification_deadline).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {event.regulatory_notification && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleNotifyRegulatory(event.id)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Notify FDA
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEscalate(event.id)}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Escalate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Safety Events */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Safety Events</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                View Trends
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-1" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
        
        <div className="divide-y">
          {mockSafetyEvents.map((event) => (
            <div 
              key={event.id}
              className="p-6 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={typeColors[event.type]}>{event.type}</Badge>
                    <Badge className={severityColors[event.severity]}>{event.severity}</Badge>
                    <Badge className={statusColors[event.status]}>
                      {event.status.replace('_', ' ')}
                    </Badge>
                    <span className="font-medium text-gray-900">{event.event}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="font-medium">Patient & Site</div>
                      <div>{event.patient} • {event.site}</div>
                      <div>{event.investigator}</div>
                    </div>
                    <div>
                      <div className="font-medium">Assessment</div>
                      <div>Relationship: {event.relationship}</div>
                      <div>Outcome: {event.outcome}</div>
                    </div>
                    <div>
                      <div className="font-medium">Timeline</div>
                      <div>Reported: {formatRelativeTime(event.reportedAt)}</div>
                      {event.notification_deadline && (
                        <div className="text-red-600">
                          Deadline: {formatRelativeTime(event.notification_deadline)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {event.action_required && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  {event.regulatory_notification && (
                    <FileText className="w-5 h-5 text-orange-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal would go here */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Safety Event Details</h3>
                <Button variant="ghost" onClick={() => setSelectedEvent(null)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Event ID</label>
                    <div className="text-sm text-gray-900">{selectedEvent.id}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <div>
                      <Badge className={typeColors[selectedEvent.type]}>
                        {selectedEvent.type}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Severity</label>
                    <div>
                      <Badge className={severityColors[selectedEvent.severity]}>
                        {selectedEvent.severity}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div>
                      <Badge className={statusColors[selectedEvent.status]}>
                        {selectedEvent.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Event</label>
                    <div className="text-sm text-gray-900">{selectedEvent.event}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Patient</label>
                    <div className="text-sm text-gray-900">{selectedEvent.patient}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Site & Investigator</label>
                    <div className="text-sm text-gray-900">
                      {selectedEvent.site} • {selectedEvent.investigator}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Relationship to Study Drug</label>
                    <div className="text-sm text-gray-900">{selectedEvent.relationship}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Outcome</label>
                    <div className="text-sm text-gray-900">{selectedEvent.outcome}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Button onClick={() => setSelectedEvent(null)}>
                    <FileText className="w-4 h-4 mr-1" />
                    View Full Report
                  </Button>
                  {selectedEvent.regulatory_notification && (
                    <Button variant="destructive">
                      <Mail className="w-4 h-4 mr-1" />
                      Submit Regulatory Report
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}