"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Target,
  Plus,
  MoreHorizontal,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  BarChart3,
  Filter,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface Task {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  dueDate?: string
  labels: string[]
}

interface Project {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  progress: number
  dueDate: string
  team: string[]
  tasks: Task[]
}

const projects: Project[] = [
  {
    id: 'protocol-v3',
    title: 'Protocol v3.0 Amendment',
    description: 'Major protocol amendment incorporating FDA feedback and biomarker collection',
    status: 'active',
    progress: 65,
    dueDate: '2024-02-15',
    team: ['Dr. Johnson', 'Dr. Chen', 'Regulatory Team'],
    tasks: [
      {
        id: 't1',
        title: 'Update primary endpoint definition',
        status: 'done',
        priority: 'high',
        assignee: 'Dr. Johnson',
        labels: ['protocol', 'fda']
      },
      {
        id: 't2', 
        title: 'Add biomarker collection procedures',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Dr. Chen',
        dueDate: '2024-01-25',
        labels: ['biomarkers', 'procedures']
      },
      {
        id: 't3',
        title: 'Update informed consent forms',
        status: 'review',
        priority: 'medium',
        assignee: 'Regulatory Team',
        labels: ['consent', 'legal']
      },
      {
        id: 't4',
        title: 'Regulatory submission preparation',
        status: 'todo',
        priority: 'high',
        dueDate: '2024-02-01',
        labels: ['regulatory', 'submission']
      }
    ]
  },
  {
    id: 'site-expansion',
    title: 'Global Site Expansion',
    description: 'Add 5 new international sites to increase enrollment capacity',
    status: 'active',
    progress: 40,
    dueDate: '2024-03-30',
    team: ['Dr. Tanaka', 'Site Manager', 'Regulatory Team'],
    tasks: [
      {
        id: 't5',
        title: 'Site qualification visits',
        status: 'in-progress',
        priority: 'medium',
        assignee: 'Site Manager',
        labels: ['sites', 'qualification']
      },
      {
        id: 't6',
        title: 'Local regulatory approvals',
        status: 'todo',
        priority: 'high',
        assignee: 'Regulatory Team',
        labels: ['regulatory', 'international']
      },
      {
        id: 't7',
        title: 'Protocol translation',
        status: 'todo',
        priority: 'medium',
        labels: ['translation', 'protocol']
      }
    ]
  }
]

const statusColumns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' }
]

const priorityColors = {
  low: 'text-gray-600 bg-gray-100',
  medium: 'text-blue-600 bg-blue-100',
  high: 'text-red-600 bg-red-100'
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(projects[0])
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')

  const getTasksByStatus = (status: string) => {
    return selectedProject.tasks.filter(task => task.status === status)
  }

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'on-hold':
        return <AlertCircle className="w-4 h-4 text-orange-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage trial workflows and track progress</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Project List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">Active Projects</h2>
            </div>
            <div className="divide-y">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full text-left p-4 hover:bg-gray-50 ${
                    selectedProject.id === project.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(project.status)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {project.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {project.progress}% complete
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div 
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Project View */}
        <div className="lg:col-span-3">
          {/* Project Header */}
          <div className="bg-white rounded-lg border mb-6 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{selectedProject.title}</h2>
                  <Badge variant={selectedProject.status === 'active' ? 'info' : 'secondary'}>
                    {selectedProject.status}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{selectedProject.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Progress:</span>
                    <div className="font-medium">{selectedProject.progress}% complete</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Due Date:</span>
                    <div className="font-medium">{new Date(selectedProject.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Team:</span>
                    <div className="font-medium">{selectedProject.team.length} members</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'board' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('board')}
                >
                  Board
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Kanban Board View */}
          {viewMode === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {statusColumns.map((column) => (
                <div key={column.id} className="bg-white rounded-lg border">
                  <div className={`p-4 border-b ${column.color}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{column.title}</h3>
                      <Badge variant="secondary">
                        {getTasksByStatus(column.id).length}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {getTasksByStatus(column.id).map((task) => (
                      <div key={task.id} className="border rounded-lg p-3 hover:shadow-sm cursor-pointer">
                        <div className="font-medium text-gray-900 text-sm mb-2">
                          {task.title}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${priorityColors[task.priority]}`}
                            >
                              {task.priority}
                            </Badge>
                            {task.labels.slice(0, 2).map((label) => (
                              <Badge key={label} variant="outline" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                          
                          {task.assignee && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                              {task.assignee.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        
                        {task.dueDate && (
                          <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500">
                      <Plus className="w-4 h-4 mr-1" />
                      Add task
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">All Tasks</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-1" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y">
                {selectedProject.tasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <input type="checkbox" className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{task.title}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${priorityColors[task.priority]}`}
                            >
                              {task.priority}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                            >
                              {task.status}
                            </Badge>
                            {task.labels.map((label) => (
                              <Badge key={label} variant="outline" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {task.assignee && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{task.assignee}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}