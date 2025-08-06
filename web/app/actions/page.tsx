"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  Download,
  Calendar,
  GitBranch,
  FileText,
  AlertTriangle,
  BarChart3,
  Shield,
  Eye
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface WorkflowRun {
  id: string
  name: string
  status: 'success' | 'failure' | 'pending' | 'cancelled'
  trigger: 'push' | 'pull_request' | 'schedule' | 'manual'
  branch: string
  commit: string
  author: string
  startTime: string
  duration?: string
  jobs: Job[]
}

interface Job {
  id: string
  name: string
  status: 'success' | 'failure' | 'pending' | 'cancelled'
  duration?: string
  logs?: string[]
}

const workflowRuns: WorkflowRun[] = [
  {
    id: 'run-001',
    name: 'Protocol Validation & Simulation',
    status: 'success',
    trigger: 'push',
    branch: 'main',
    commit: 'a1b2c3d',
    author: 'Dr. Johnson',
    startTime: '2024-01-20T14:30:00Z',
    duration: '3m 45s',
    jobs: [
      {
        id: 'job-001',
        name: 'YAML Validation',
        status: 'success',
        duration: '45s'
      },
      {
        id: 'job-002',
        name: 'Compliance Check',
        status: 'success',
        duration: '1m 20s'
      },
      {
        id: 'job-003',
        name: 'Synthetic Twin Simulation',
        status: 'success',
        duration: '1m 40s'
      }
    ]
  },
  {
    id: 'run-002',
    name: 'Protocol Validation & Simulation',
    status: 'failure',
    trigger: 'pull_request',
    branch: 'feature/fda-feedback',
    commit: 'e4f5g6h',
    author: 'Dr. Martinez',
    startTime: '2024-01-20T09:15:00Z',
    duration: '2m 12s',
    jobs: [
      {
        id: 'job-004',
        name: 'YAML Validation',
        status: 'failure',
        duration: '30s',
        logs: ['Error: Missing required field "primaryEndpoint"', 'Line 45: Invalid date format']
      },
      {
        id: 'job-005',
        name: 'Compliance Check',
        status: 'cancelled',
        duration: '0s'
      },
      {
        id: 'job-006',
        name: 'Synthetic Twin Simulation',
        status: 'cancelled',
        duration: '0s'
      }
    ]
  },
  {
    id: 'run-003',
    name: 'Scheduled Compliance Check',
    status: 'success',
    trigger: 'schedule',
    branch: 'main',
    commit: 'i7j8k9l',
    author: 'System',
    startTime: '2024-01-20T00:00:00Z',
    duration: '5m 30s',
    jobs: [
      {
        id: 'job-007',
        name: 'IRB Compliance',
        status: 'success',
        duration: '2m 15s'
      },
      {
        id: 'job-008',
        name: 'FDA Compliance',
        status: 'success',
        duration: '3m 15s'
      }
    ]
  },
  {
    id: 'run-004',
    name: 'Data Quality Check',
    status: 'pending',
    trigger: 'manual',
    branch: 'main',
    commit: 'm1n2o3p',
    author: 'Data Manager',
    startTime: '2024-01-20T15:45:00Z',
    jobs: [
      {
        id: 'job-009',
        name: 'Data Validation',
        status: 'pending'
      },
      {
        id: 'job-010',
        name: 'Query Generation',
        status: 'pending'
      }
    ]
  }
]

const workflows = [
  {
    name: 'Protocol Validation & Simulation',
    description: 'Validates protocol YAML, runs compliance checks, and generates synthetic twins',
    trigger: 'On push to main, PR creation',
    lastRun: '2024-01-20T14:30:00Z',
    status: 'active'
  },
  {
    name: 'Scheduled Compliance Check',
    description: 'Daily compliance verification for IRB and regulatory requirements',
    trigger: 'Daily at midnight UTC',
    lastRun: '2024-01-20T00:00:00Z',
    status: 'active'
  },
  {
    name: 'Data Quality Check',
    description: 'Validates patient data and generates quality reports',
    trigger: 'Manual trigger only',
    lastRun: '2024-01-19T10:15:00Z',
    status: 'active'
  },
  {
    name: 'Safety Monitoring',
    description: 'Automated safety signal detection and AE reporting',
    trigger: 'On data updates',
    lastRun: '2024-01-19T16:20:00Z',
    status: 'active'
  }
]

const statusColors = {
  success: 'text-green-600 bg-green-100',
  failure: 'text-red-600 bg-red-100',
  pending: 'text-yellow-600 bg-yellow-100',
  cancelled: 'text-gray-600 bg-gray-100'
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />
    case 'failure':
      return <XCircle className="w-5 h-5 text-red-500" />
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />
    case 'cancelled':
      return <XCircle className="w-5 h-5 text-gray-500" />
  }
}

export default function ActionsPage() {
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Actions & Workflows</h1>
          <p className="text-gray-600 mt-1">Automated validation, compliance, and simulation workflows</p>
        </div>
        <Button>
          <Play className="w-4 h-4 mr-2" />
          Run Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Runs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Runs */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Workflow Runs</h2>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="divide-y">
              {workflowRuns.map((run) => (
                <div 
                  key={run.id} 
                  className="p-6 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedRun(run)}
                >
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(run.status)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{run.name}</h3>
                        <Badge className={statusColors[run.status]}>
                          {run.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <GitBranch className="w-4 h-4" />
                            <span>{run.branch}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>#{run.commit}</span>
                          </div>
                          <div>{run.author}</div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span>Triggered by {run.trigger}</span>
                          <span>{formatRelativeTime(run.startTime)}</span>
                          {run.duration && <span>• {run.duration}</span>}
                        </div>
                      </div>
                      
                      {/* Job Status Summary */}
                      <div className="flex items-center space-x-2 mt-2">
                        {run.jobs.map((job) => (
                          <div
                            key={job.id}
                            className={`w-3 h-3 rounded-full ${
                              job.status === 'success' ? 'bg-green-500' :
                              job.status === 'failure' ? 'bg-red-500' :
                              job.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}
                            title={job.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Run Details */}
          {selectedRun && (
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedRun.status)}
                  <h2 className="text-lg font-semibold">{selectedRun.name}</h2>
                  <Badge className={statusColors[selectedRun.status]}>
                    {selectedRun.status}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-gray-500">Commit:</span>
                    <div className="font-medium">#{selectedRun.commit}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Branch:</span>
                    <div className="font-medium">{selectedRun.branch}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <div className="font-medium">{selectedRun.duration || 'Running...'}</div>
                  </div>
                </div>

                {/* Jobs */}
                <div className="space-y-3">
                  {selectedRun.jobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(job.status)}
                          <span className="font-medium">{job.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{job.duration}</span>
                      </div>
                      
                      {job.logs && job.logs.length > 0 && (
                        <div className="bg-gray-50 rounded p-3 mt-2">
                          <div className="text-sm font-medium text-gray-700 mb-2">Error Logs:</div>
                          {job.logs.map((log, index) => (
                            <div key={index} className="text-sm text-red-600 font-mono">
                              {log}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Available Workflows */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Available Workflows</h3>
            </div>
            <div className="divide-y">
              {workflows.map((workflow, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-sm">{workflow.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{workflow.description}</p>
                  <div className="text-xs text-gray-500">
                    Last run: {formatRelativeTime(workflow.lastRun)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Validate Protocol
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Run Simulation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Compliance Check
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Safety Review
              </Button>
            </div>
          </div>

          {/* Workflow Status */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Workflow Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Duration</span>
                <span className="font-medium">3m 42s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Runs</span>
                <span className="font-medium">157</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}