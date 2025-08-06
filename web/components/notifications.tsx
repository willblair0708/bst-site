"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bell,
  X,
  AlertTriangle,
  CheckCircle2,
  GitPullRequest,
  Users,
  FileText,
  Calendar,
  Clock,
  MoreHorizontal
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface Notification {
  id: string
  type: 'safety' | 'amendment' | 'enrollment' | 'pr' | 'system' | 'deadline'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  actionUrl?: string
  data?: any
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'safety',
    title: 'SAE Reported - Immediate Action Required',
    message: 'Grade 3 neutropenia reported for patient CTP-019. FDA notification due within 24 hours.',
    timestamp: '2024-01-20T16:30:00Z',
    read: false,
    priority: 'critical',
    actionUrl: '/issues/new?type=safety'
  },
  {
    id: '2',
    type: 'pr',
    title: 'Pull Request Approved',
    message: 'Dr. Chen approved PR #12: Add Japan sites to protocol',
    timestamp: '2024-01-20T15:45:00Z',
    read: false,
    priority: 'medium',
    actionUrl: '/pull-requests/12'
  },
  {
    id: '3',
    type: 'enrollment',
    title: 'New Patient Enrolled',
    message: 'Patient CTP-025 enrolled at Johns Hopkins by Dr. Martinez',
    timestamp: '2024-01-20T14:22:00Z',
    read: true,
    priority: 'low',
    actionUrl: '/analytics'
  },
  {
    id: '4',
    type: 'deadline',
    title: 'Amendment Deadline Approaching',
    message: 'Protocol amendment #3 review deadline in 2 days',
    timestamp: '2024-01-20T12:00:00Z',
    read: false,
    priority: 'high',
    actionUrl: '/issues/3'
  },
  {
    id: '5',
    type: 'system',
    title: 'Synthetic Twin Generation Complete',
    message: '50 new synthetic control twins generated successfully',
    timestamp: '2024-01-20T10:15:00Z',
    read: true,
    priority: 'medium',
    actionUrl: '/analytics?tab=synthetic'
  }
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'safety':
      return <AlertTriangle className="w-5 h-5 text-red-500" />
    case 'amendment':
      return <FileText className="w-5 h-5 text-blue-500" />
    case 'enrollment':
      return <Users className="w-5 h-5 text-green-500" />
    case 'pr':
      return <GitPullRequest className="w-5 h-5 text-purple-500" />
    case 'deadline':
      return <Calendar className="w-5 h-5 text-orange-500" />
    default:
      return <CheckCircle2 className="w-5 h-5 text-gray-500" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 border-red-200'
    case 'high':
      return 'bg-orange-100 border-orange-200'
    case 'medium':
      return 'bg-blue-100 border-blue-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant={criticalCount > 0 ? "destructive" : "secondary"}
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg border shadow-lg z-50 max-h-[600px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Notifications ({unreadCount} unread)
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 ${
                        !notification.read ? 'bg-blue-50' : ''
                      } ${getPriorityColor(notification.priority)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                                {notification.priority === 'critical' && (
                                  <Badge variant="destructive" className="text-xs">
                                    Critical
                                  </Badge>
                                )}
                                {notification.priority === 'high' && (
                                  <Badge variant="warning" className="text-xs">
                                    High
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {notification.actionUrl && (
                            <div className="mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  window.location.href = notification.actionUrl!
                                  setIsOpen(false)
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-gray-50">
              <Button variant="ghost" size="sm" className="w-full">
                View All Notifications
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function NotificationToast({ notification, onDismiss }: { 
  notification: Notification, 
  onDismiss: () => void 
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className={`
      fixed top-4 right-4 z-50 w-96 bg-white rounded-lg border shadow-lg
      ${getPriorityColor(notification.priority)}
    `}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {notification.message}
            </p>
            
            {notification.actionUrl && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = notification.actionUrl!
                    onDismiss()
                  }}
                >
                  View Details
                </Button>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}