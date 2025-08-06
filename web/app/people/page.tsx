"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Award,
  Clock,
  Building,
  Stethoscope,
  Search,
  Filter,
  MoreHorizontal,
  Settings,
  Eye
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  title: string
  institution: string
  location: string
  avatar?: string
  joinDate: string
  lastActive: string
  permissions: string[]
  specialty?: string
  phone?: string
  status: 'active' | 'inactive' | 'pending'
  stats: {
    enrollments: number
    protocols: number
    amendments: number
  }
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.edu',
    role: 'Principal Investigator',
    title: 'MD, PhD',
    institution: 'Memorial Sloan Kettering',
    location: 'New York, NY',
    joinDate: '2023-06-15',
    lastActive: '2024-01-20T15:30:00Z',
    permissions: ['admin', 'protocol-edit', 'patient-data', 'site-management'],
    specialty: 'Medical Oncology',
    phone: '+1 (555) 123-4567',
    status: 'active',
    stats: {
      enrollments: 8,
      protocols: 3,
      amendments: 5
    }
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@johns-hopkins.edu',
    role: 'Site Investigator',
    title: 'MD',
    institution: 'Johns Hopkins University',
    location: 'Baltimore, MD',
    joinDate: '2023-08-01',
    lastActive: '2024-01-20T09:15:00Z',
    permissions: ['protocol-view', 'patient-data', 'enrollment'],
    specialty: 'Pulmonology',
    status: 'active',
    stats: {
      enrollments: 5,
      protocols: 1,
      amendments: 2
    }
  },
  {
    id: '3',
    name: 'Dr. Lisa Martinez',
    email: 'lisa.martinez@mdanderson.org',
    role: 'Site Investigator',
    title: 'MD, PhD',
    institution: 'MD Anderson Cancer Center',
    location: 'Houston, TX',
    joinDate: '2023-09-15',
    lastActive: '2024-01-19T14:22:00Z',
    permissions: ['protocol-view', 'patient-data', 'enrollment'],
    specialty: 'Medical Oncology',
    status: 'active',
    stats: {
      enrollments: 4,
      protocols: 1,
      amendments: 1
    }
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    email: 'james.wilson@mayo.edu',
    role: 'Site Investigator',
    title: 'MD',
    institution: 'Mayo Clinic',
    location: 'Rochester, MN',
    joinDate: '2023-10-01',
    lastActive: '2024-01-20T11:45:00Z',
    permissions: ['protocol-view', 'patient-data', 'enrollment'],
    specialty: 'Thoracic Surgery',
    status: 'active',
    stats: {
      enrollments: 7,
      protocols: 1,
      amendments: 3
    }
  },
  {
    id: '5',
    name: 'Dr. Emma Davis',
    email: 'emma.davis@dana-farber.org',
    role: 'Site Investigator',
    title: 'MD',
    institution: 'Dana-Farber Cancer Institute',
    location: 'Boston, MA',
    joinDate: '2024-01-10',
    lastActive: '2024-01-18T16:30:00Z',
    permissions: ['protocol-view'],
    specialty: 'Medical Oncology',
    status: 'pending',
    stats: {
      enrollments: 0,
      protocols: 0,
      amendments: 0
    }
  },
  {
    id: '6',
    name: 'Sarah Thompson',
    email: 'sarah.thompson@cro.com',
    role: 'Data Manager',
    title: 'MS',
    institution: 'Clinical Research Organization',
    location: 'Remote',
    joinDate: '2023-07-01',
    lastActive: '2024-01-20T13:20:00Z',
    permissions: ['data-management', 'protocol-view'],
    status: 'active',
    stats: {
      enrollments: 0,
      protocols: 2,
      amendments: 8
    }
  },
  {
    id: '7',
    name: 'Mark Rodriguez',
    email: 'mark.rodriguez@regulatory.com',
    role: 'Regulatory Manager',
    title: 'MS, RAC',
    institution: 'Regulatory Consulting Group',
    location: 'San Francisco, CA',
    joinDate: '2023-06-01',
    lastActive: '2024-01-19T10:15:00Z',
    permissions: ['regulatory', 'protocol-edit', 'amendments'],
    status: 'active',
    stats: {
      enrollments: 0,
      protocols: 3,
      amendments: 12
    }
  }
]

const roles = [
  { name: 'Principal Investigator', count: 1, description: 'Lead investigator with full study access' },
  { name: 'Site Investigator', count: 4, description: 'Site-level investigators managing patient enrollment' },
  { name: 'Data Manager', count: 1, description: 'Responsible for data quality and management' },
  { name: 'Regulatory Manager', count: 1, description: 'Handles regulatory submissions and compliance' }
]

const statusColors = {
  active: 'text-green-600 bg-green-100',
  inactive: 'text-gray-600 bg-gray-100',
  pending: 'text-yellow-600 bg-yellow-100'
}

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>('all')

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">People & Teams</h1>
          <p className="text-gray-600 mt-1">Manage investigators, team members, and permissions</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6">
          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{teamMembers.length}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {teamMembers.filter(m => m.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {teamMembers.filter(m => m.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Institutions</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-md text-sm w-64"
                  />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </Button>
            </div>
          </div>

          {/* Team Members List */}
          <div className="bg-white rounded-lg border">
            <div className="divide-y">
              {filteredMembers.map((member) => (
                <div key={member.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {getInitials(member.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                        <Badge className={statusColors[member.status]}>
                          {member.status}
                        </Badge>
                        {member.role === 'Principal Investigator' && (
                          <Badge variant="outline" className="text-purple-600">
                            <Shield className="w-3 h-3 mr-1" />
                            PI
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="w-4 h-4" />
                            <span>{member.role}</span>
                            {member.title && <span>• {member.title}</span>}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4" />
                            <span>{member.institution}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{member.location}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>Last active {formatRelativeTime(member.lastActive)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 mt-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{member.stats.enrollments}</div>
                          <div className="text-gray-500">Enrollments</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{member.stats.protocols}</div>
                          <div className="text-gray-500">Protocols</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{member.stats.amendments}</div>
                          <div className="text-gray-500">Amendments</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div key={role.name} className="bg-white p-6 rounded-lg border">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold">{role.name}</h3>
                    <p className="text-sm text-gray-600">{role.count} members</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{role.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Permissions
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Team Activity</h2>
            </div>
            <div className="divide-y">
              <div className="p-6 flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Dr. Johnson enrolled patient CTP-024</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="p-6 flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Mark Rodriguez submitted amendment #12</span>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <div className="p-6 flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Dr. Davis completed GCP training</span>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}