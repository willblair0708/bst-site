"use client"

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
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
  BellDot,
  Archive,
  ExternalLink,
  Filter,
  Zap,
  Shield,
  Sparkles,
  TrendingUp,
  Activity,
  Flame,
  Target
} from 'lucide-react'
import { formatRelativeTime, cn } from '@/lib/utils'
import { EASING } from '@/lib/motion/tokens'

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

const getNotificationIcon = (type: string, priority: string) => {
  const iconClasses = "w-4 h-4"
  
  switch (type) {
    case 'safety':
      return <AlertTriangle className={cn(iconClasses, "text-destructive")} />
    case 'amendment':
      return <FileText className={cn(iconClasses, "text-primary")} />
    case 'enrollment':
      return <Users className={cn(iconClasses, "text-accent")} />
    case 'pr':
      return <GitPullRequest className={cn(iconClasses, "text-purple-500")} />
    case 'deadline':
      return <Calendar className={cn(iconClasses, "text-amber-500")} />
    case 'system':
      return <CheckCircle2 className={cn(iconClasses, "text-emerald-500")} />
    default:
      return <CheckCircle2 className={cn(iconClasses, "text-muted-foreground")} />
  }
}

const getPriorityIndicator = (priority: string, read: boolean) => {
  switch (priority) {
    case 'critical':
      return (
        <div className="w-3 h-3 rounded-md bg-destructive flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-sm bg-white" />
        </div>
      )
    case 'high':
      return <div className="w-2.5 h-2.5 rounded-md bg-amber-500" />
    case 'medium':
      return <div className="w-2 h-2 rounded-sm bg-primary" />
    default:
      return <div className="w-1.5 h-1.5 rounded-sm bg-muted-foreground/60" />
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()


  const unreadCount = notifications.filter(n => !n.read).length
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length

  // Smart notification filtering and grouping
  const filteredNotifications = useMemo(() => {
    let filtered = notifications
    
    switch (filter) {
      case 'unread':
        filtered = notifications.filter(n => !n.read)
        break
      case 'critical':
        filtered = notifications.filter(n => n.priority === 'critical')
        break
      default:
        filtered = notifications
    }
    
    // Sort by priority and timestamp
    return filtered.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4
      
      if (aPriority !== bPriority) return aPriority - bPriority
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
  }, [notifications, filter])

  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: typeof filteredNotifications } = {
      today: [],
      yesterday: [],
      older: []
    }
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    
    filteredNotifications.forEach(notification => {
      const notificationDate = new Date(notification.timestamp)
      const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate())
      
      if (notificationDay.getTime() === today.getTime()) {
        groups.today.push(notification)
      } else if (notificationDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notification)
      } else {
        groups.older.push(notification)
      }
    })
    
    return groups
  }, [filteredNotifications])

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

  // Keep other animations but remove bell movement

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={dropdownRef}
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl relative overflow-hidden hover:bg-transparent border-0 focus:ring-0"
            title={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          >
            <AnimatePresence mode="wait">
              {unreadCount > 0 ? (
                <motion.div
                  key="bell-dot"
                  initial={!prefersReducedMotion ? { opacity: 0, rotate: -180, scale: 0.5 } : { opacity: 1 }}
                  animate={!prefersReducedMotion ? { 
                    opacity: 1, 
                    rotate: 0, 
                    scale: 1,
                    color: "hsl(var(--muted-foreground))"
                  } : { opacity: 1 }}
                  exit={!prefersReducedMotion ? { opacity: 0, rotate: 180, scale: 0.5 } : { opacity: 0 }}
                  whileHover={!prefersReducedMotion ? {
                    color: "hsl(var(--foreground))",
                    filter: "drop-shadow(0 0 8px hsl(var(--accent) / 0.4))",
                    rotate: [0, -10, 10, 0]
                  } : undefined}
                  transition={{ duration: 0.3, ease: EASING.smooth }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <BellDot className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="bell"
                  initial={!prefersReducedMotion ? { opacity: 0, rotate: 180, scale: 0.5 } : { opacity: 1 }}
                  animate={!prefersReducedMotion ? { 
                    opacity: 1, 
                    rotate: 0, 
                    scale: 1,
                    color: "hsl(var(--muted-foreground))"
                  } : { opacity: 1 }}
                  exit={!prefersReducedMotion ? { opacity: 0, rotate: -180, scale: 0.5 } : { opacity: 0 }}
                  whileHover={!prefersReducedMotion ? {
                    color: "hsl(var(--foreground))",
                    filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.4))",
                    rotate: [0, 15, -15, 0]
                  } : undefined}
                  transition={{ duration: 0.3, ease: EASING.smooth }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Bell className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </DropdownMenuTrigger>
        
        {/* Notification count badge - positioned outside button container */}
        {unreadCount > 0 && (
          <Badge 
            className={cn(
              "absolute -top-2 -right-2 h-5 w-5 rounded-xl p-0 text-xs text-foreground",
              "flex items-center justify-center z-50 pointer-events-none",
              criticalCount > 0 ? "bg-destructive" : "bg-primary"
            )}
          >
            {unreadCount > 99 ? '99' : unreadCount}
          </Badge>
        )}

      <DropdownMenuContent 
        align="end" 
        className="w-[420px] max-h-[650px] overflow-hidden bg-background/95 backdrop-blur-sm border border-border shadow-elevation-4 rounded-2xl"
        sideOffset={12}
      >
        {/* Header with Filters */}
        <div className="border-b border-border bg-background">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <DropdownMenuLabel className="text-lg font-semibold text-foreground p-0">
                Notifications
              </DropdownMenuLabel>
              {unreadCount > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-sm bg-primary" />
                  <span className="text-xs text-muted-foreground">
                    {unreadCount} unread
                  </span>
                </div>
              )}
            </div>
            
                {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                                  className="h-7 px-3 text-xs text-gray-700 hover:bg-gray-100"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
          </div>
          
          {/* Smart Filter Tabs */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center space-x-1 bg-muted rounded-2xl p-1">
              {(['all', 'unread', 'critical'] as const).map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className={cn(
                    "h-6 px-3 text-xs font-medium transition-all duration-200 rounded-xl",
                    filter === filterType && "shadow-sm bg-background text-foreground"
                  )}
                >
                  {filterType === 'all' && <Filter className="w-3 h-3 mr-1" />}
                  {filterType === 'critical' && <Shield className="w-3 h-3 mr-1" />}
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  {filterType === 'unread' && unreadCount > 0 && (
                    <span className="ml-1 text-2xs">({unreadCount})</span>
                  )}
                  {filterType === 'critical' && criticalCount > 0 && (
                    <span className="ml-1 text-2xs">({criticalCount})</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Notifications List with Grouping */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              </motion.div>
              <p className="text-sm text-muted-foreground font-medium">
                {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                You're all caught up!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-1">
              {Object.entries(groupedNotifications).map(([groupKey, groupNotifications]) => {
                if (groupNotifications.length === 0) return null
                
                const groupLabels = {
                  today: "Today",
                  yesterday: "Yesterday", 
                  older: "Earlier"
                }
                
                return (
                  <motion.div 
                    key={groupKey}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Group Header */}
                    <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-2">
                      <h3 className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                        {groupLabels[groupKey as keyof typeof groupLabels]}
                        <span className="ml-2 text-2xs">({groupNotifications.length})</span>
                      </h3>
                </div>
                    
                    {/* Group Notifications */}
                    <div>
                      {groupNotifications.map((notification, index) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "group relative border-b border-border/30 last:border-b-0 transition-colors duration-200",
                            "hover:bg-accent/5",
                            !notification.read && "bg-accent/5"
                          )}
                        >
                          <div className="p-4 space-y-3">
                            {/* Enhanced Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                {getNotificationIcon(notification.type, notification.priority)}
                                {getPriorityIndicator(notification.priority, notification.read)}
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-mono text-muted-foreground">
                                    {formatRelativeTime(notification.timestamp)}
                                  </span>
                                  {!notification.read && (
                                    <div className="w-1.5 h-1.5 rounded-sm bg-accent" />
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 hover:bg-accent/20 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      markAsRead(notification.id)
                                    }}
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotification(notification.id)
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                        </div>
                        
                            {/* Enhanced Content */}
                            <div className="space-y-2">
                              <h4 className={cn(
                                "text-sm font-medium leading-snug font-display",
                                !notification.read 
                                  ? "text-foreground" 
                                  : "text-muted-foreground"
                              )}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {notification.message}
                              </p>
                            </div>

                            {/* Enhanced Priority & Action Row */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {(notification.priority === 'critical' || notification.priority === 'high') && (
                                  <Badge 
                                    variant={notification.priority === 'critical' ? "destructive" : "secondary"}
                                    className={cn(
                                      "text-2xs px-2 py-0.5 font-mono font-medium rounded-full",
                                      notification.priority === 'critical' && "shadow-sm shadow-destructive/20"
                                    )}
                                  >
                                    {notification.priority.toUpperCase()}
                                  </Badge>
                                )}
                            </div>
                            
                              {notification.actionUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={cn(
                                    "h-7 px-3 text-xs transition-all duration-300",
                                    "hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10",
                                    "focus:ring-2 focus:ring-primary/30 focus:ring-offset-1"
                                  )}
                                  onClick={() => {
                                    window.location.href = notification.actionUrl!
                                    if (!notification.read) markAsRead(notification.id)
                                    setIsOpen(false)
                                  }}
                                >
                                  <ExternalLink className="w-3 h-3 mr-1.5" />
                                  View Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
                </div>
              )}
            </div>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}

export function NotificationToast({ notification, onDismiss }: { 
  notification: Notification, 
  onDismiss: () => void 
}) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, 5000)

    const progressTimer = setInterval(() => {
      setProgress(prev => Math.max(0, prev - 2))
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
    }
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9, rotateY: -15 }}
      animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, x: 100, scale: 0.9, rotateY: 15 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "fixed top-4 right-4 z-50 w-[400px] rounded-xl overflow-hidden",
        "bg-card/95 backdrop-blur-xl border border-border/50",
        "shadow-2xl shadow-black/10 dark:shadow-black/40",
        "paper-layers"
      )}
    >
      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className={cn(
            "h-full transition-all duration-100",
            notification.priority === 'critical' 
              ? "bg-gradient-to-r from-destructive to-red-500" 
              : "bg-gradient-to-r from-primary to-blue-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-2">
            {getNotificationIcon(notification.type, notification.priority)}
            {getPriorityIndicator(notification.priority, false)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-card-foreground font-display">
              {notification.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between mt-3">
            {notification.actionUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-xs transition-all duration-300",
                    "hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10"
                  )}
                  onClick={() => {
                    window.location.href = notification.actionUrl!
                    onDismiss()
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1.5" />
                  View Details
                </Button>
              )}
              
              <div className="flex items-center space-x-1 text-2xs text-muted-foreground/60">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeTime(notification.timestamp)}</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            onClick={onDismiss}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}