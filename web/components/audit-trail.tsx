"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield,
  User,
  FileText,
  Database,
  Settings,
  GitCommit,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Edit,
  Trash2,
  UserPlus,
  UserMinus
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface AuditEvent {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  resourceId: string
  details: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'failure' | 'warning'
  category: 'data' | 'protocol' | 'user' | 'system' | 'safety' | 'regulatory'
  criticality: 'low' | 'medium' | 'high' | 'critical'
  changes?: {
    field: string
    before: string
    after: string
  }[]
}

const mockAuditEvents: AuditEvent[] = [
  {
    id: 'audit-001',
    timestamp: '2024-01-20T16:30:00Z',
    user: 'Dr. Johnson',
    action: 'Patient Data Modified',
    resource: 'Patient Record',
    resourceId: 'CTP-019',
    details: 'Updated adverse event severity from Grade 2 to Grade 3',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'success',
    category: 'data',
    criticality: 'high',
    changes: [
      {
        field: 'adverse_event.severity',
        before: 'Grade 2',
        after: 'Grade 3'
      }
    ]
  },
  {
    id: 'audit-002',
    timestamp: '2024-01-20T15:45:00Z',
    user: 'Dr. Chen',
    action: 'Protocol Amendment Approved',
    resource: 'Protocol',
    resourceId: 'CTP-ABC123-v2.1',
    details: 'Approved biomarker collection amendment',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success',
    category: 'protocol',
    criticality: 'critical'
  },
  {
    id: 'audit-003',
    timestamp: '2024-01-20T14:22:00Z',
    user: 'System',
    action: 'Automated Backup',
    resource: 'Database',
    resourceId: 'trial-db-001',
    details: 'Scheduled database backup completed successfully',
    ipAddress: '10.0.0.1',
    userAgent: 'BackupService/1.0',
    status: 'success',
    category: 'system',
    criticality: 'low'
  },
  {
    id: 'audit-004',
    timestamp: '2024-01-20T13:15:00Z',
    user: 'Regulatory Team',
    action: 'SAE Report Submitted',
    resource: 'Safety Report',
    resourceId: 'SAE-001',
    details: 'Submitted Grade 3 neutropenia SAE report to FDA',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'success',
    category: 'safety',
    criticality: 'critical'
  },
  {
    id: 'audit-005',
    timestamp: '2024-01-20T12:00:00Z',
    user: 'Admin',
    action: 'User Permission Modified',
    resource: 'User Account',
    resourceId: 'user-dr-davis',
    details: 'Granted protocol editing permissions to Dr. Davis',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'success',
    category: 'user',
    criticality: 'medium',
    changes: [
      {
        field: 'permissions',
        before: 'protocol-view',
        after: 'protocol-view, protocol-edit'
      }
    ]
  },
  {
    id: 'audit-006',
    timestamp: '2024-01-20T11:30:00Z',
    user: 'Dr. Martinez',
    action: 'Failed Login Attempt',
    resource: 'Authentication',
    resourceId: 'login-attempt',
    details: 'Failed login attempt - incorrect password',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'failure',
    category: 'user',
    criticality: 'medium'
  }
]

const categoryColors = {
  'data': 'text-blue-600 bg-blue-100',
  'protocol': 'text-purple-600 bg-purple-100',
  'user': 'text-green-600 bg-green-100',
  'system': 'text-gray-600 bg-gray-100',
  'safety': 'text-red-600 bg-red-100',
  'regulatory': 'text-orange-600 bg-orange-100'
}

const statusColors = {
  'success': 'text-green-600 bg-green-100',
  'failure': 'text-red-600 bg-red-100',
  'warning': 'text-yellow-600 bg-yellow-100'
}

const criticalityColors = {
  'low': 'text-gray-600 bg-gray-100',
  'medium': 'text-blue-600 bg-blue-100',
  'high': 'text-orange-600 bg-orange-100',
  'critical': 'text-red-600 bg-red-100'
}

const getActionIcon = (action: string) => {
  if (action.includes('Modified') || action.includes('Updated')) {
    return <Edit className="w-4 h-4" />
  } else if (action.includes('Deleted')) {
    return <Trash2 className="w-4 h-4" />
  } else if (action.includes('Added') || action.includes('Created')) {
    return <UserPlus className="w-4 h-4" />
  } else if (action.includes('Login')) {
    return action.includes('Failed') ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />
  } else if (action.includes('Backup')) {
    return <Database className="w-4 h-4" />
  } else if (action.includes('Approved')) {
    return <CheckCircle2 className="w-4 h-4" />
  } else {
    return <FileText className="w-4 h-4" />
  }
}

export function AuditTrail() {
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterCriticality, setFilterCriticality] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEvents = mockAuditEvents.filter(event => {
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory
    const matchesCriticality = filterCriticality === 'all' || event.criticality === filterCriticality
    const matchesSearch = event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.details.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesCriticality && matchesSearch
  })

  const criticalEvents = mockAuditEvents.filter(e => e.criticality === 'critical').length
  const failureEvents = mockAuditEvents.filter(e => e.status === 'failure').length
  const todayEvents = mockAuditEvents.filter(e => 
    new Date(e.timestamp).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="space-y-6">
      {/* Audit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">{mockAuditEvents.length}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">{criticalEvents}</div>
              <div className="text-sm text-gray-600">Critical Events</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-600">{failureEvents}</div>
              <div className="text-sm text-gray-600">Failed Actions</div>
            </div>
            <Lock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">{todayEvents}</div>
              <div className="text-sm text-gray-600">Today's Events</div>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Audit Trail</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Advanced Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search audit events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border rounded-md text-sm"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="data">Data</option>
              <option value="protocol">Protocol</option>
              <option value="user">User</option>
              <option value="system">System</option>
              <option value="safety">Safety</option>
              <option value="regulatory">Regulatory</option>
            </select>
            
            <select
              value={filterCriticality}
              onChange={(e) => setFilterCriticality(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Criticality</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Events List */}
        <div className="divide-y">
          {filteredEvents.map((event) => (
            <div 
              key={event.id}
              className="p-6 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className={`p-2 rounded-lg ${categoryColors[event.category]}`}>
                    {getActionIcon(event.action)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">{event.action}</span>
                    <Badge className={statusColors[event.status]}>
                      {event.status}
                    </Badge>
                    <Badge className={categoryColors[event.category]}>
                      {event.category}
                    </Badge>
                    <Badge className={criticalityColors[event.criticality]}>
                      {event.criticality}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{event.details}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">User:</span> {event.user}
                    </div>
                    <div>
                      <span className="font-medium">Resource:</span> {event.resource}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {formatRelativeTime(event.timestamp)}
                    </div>
                    <div>
                      <span className="font-medium">IP:</span> {event.ipAddress}
                    </div>
                  </div>
                  
                  {event.changes && event.changes.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs font-medium text-gray-700 mb-2">Changes Made:</div>
                      {event.changes.map((change, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          <span className="font-medium">{change.field}:</span>
                          <span className="text-red-600 line-through ml-1">{change.before}</span>
                          <span className="mx-2">→</span>
                          <span className="text-green-600">{change.after}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Audit Event Details</h3>
                <Button variant="ghost" onClick={() => setSelectedEvent(null)}>
                  <Lock className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Event ID</label>
                    <div className="text-sm text-gray-900 font-mono">{selectedEvent.id}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Timestamp</label>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedEvent.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">User</label>
                    <div className="text-sm text-gray-900">{selectedEvent.user}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">IP Address</label>
                    <div className="text-sm text-gray-900 font-mono">{selectedEvent.ipAddress}</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Action</label>
                  <div className="text-sm text-gray-900">{selectedEvent.action}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Resource</label>
                  <div className="text-sm text-gray-900">
                    {selectedEvent.resource} ({selectedEvent.resourceId})
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Details</label>
                  <div className="text-sm text-gray-900">{selectedEvent.details}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">User Agent</label>
                  <div className="text-xs text-gray-600 font-mono break-all">
                    {selectedEvent.userAgent}
                  </div>
                </div>
                
                {selectedEvent.changes && selectedEvent.changes.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Field Changes</label>
                    <div className="mt-2 space-y-2">
                      {selectedEvent.changes.map((change, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                          <div className="font-medium text-gray-900">{change.field}</div>
                          <div className="mt-1">
                            <span className="text-red-600">Before: {change.before}</span>
                          </div>
                          <div>
                            <span className="text-green-600">After: {change.after}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}