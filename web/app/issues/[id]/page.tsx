"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Plus,
  Edit,
  Lock,
  Unlock,
  Tag,
  User,
  Calendar,
  Clock,
  FileText,
  Link as LinkIcon,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  type: 'comment' | 'system'
}

interface Issue {
  id: number
  title: string
  status: 'open' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'amendment' | 'regulatory' | 'protocol' | 'data' | 'safety'
  author: string
  assignee?: string
  createdAt: string
  updatedAt: string
  description: string
  labels: string[]
  attachments: string[]
  comments: Comment[]
  relatedPRs: number[]
}

// Mock data - would come from API
const issue: Issue = {
  id: 1,
  title: "Amendment Request: Add biomarker collection protocol",
  status: "open",
  priority: "high",
  type: "amendment",
  author: "Dr. Chen",
  assignee: "Dr. Johnson",
  createdAt: "2024-01-20T09:00:00Z",
  updatedAt: "2024-01-20T15:30:00Z",
  description: `## Background
IRB feedback requests addition of optional biomarker collection for exploratory analysis of immune markers and resistance mechanisms.

## Proposed Changes
1. Add optional blood collection timepoints at baseline, C1D15, C2D1, and EOT
2. Update informed consent to include biomarker collection
3. Add laboratory manual section for sample processing
4. Update protocol schema to include biomarker endpoints

## Regulatory Impact
- IRB amendment required
- FDA notification (30-day safety update)
- Site training needed for new procedures

## Timeline
Target completion: February 15, 2024`,
  labels: ["amendment", "biomarkers", "protocol-change", "high-priority"],
  attachments: ["IRB_feedback_letter.pdf", "biomarker_collection_SOP.pdf"],
  comments: [
    {
      id: "c1",
      author: "Dr. Johnson",
      content: "Thanks for submitting this. I'll review the IRB feedback and coordinate with the regulatory team. We'll need to update the statistical analysis plan as well.",
      timestamp: "2024-01-20T10:15:00Z",
      type: "comment"
    },
    {
      id: "c2",
      author: "System",
      content: "Dr. Johnson was assigned to this issue",
      timestamp: "2024-01-20T10:16:00Z",
      type: "system"
    },
    {
      id: "c3",
      author: "Regulatory Team",
      content: "From regulatory perspective, this is feasible. We'll need approximately 2-3 weeks for IRB submission and review. I'll prepare the amendment documents.",
      timestamp: "2024-01-20T14:22:00Z",
      type: "comment"
    },
    {
      id: "c4",
      author: "Dr. Wilson",
      content: "Lab is ready to support biomarker collection. Updated SOP attached. We can provide site training within 1 week of approval.",
      timestamp: "2024-01-20T15:30:00Z",
      type: "comment"
    }
  ],
  relatedPRs: [12, 13]
}

const priorityColors = {
  low: 'text-gray-600 bg-gray-100',
  medium: 'text-blue-600 bg-blue-100',
  high: 'text-orange-600 bg-orange-100',
  critical: 'text-red-600 bg-red-100'
}

const typeColors = {
  amendment: 'text-purple-600 bg-purple-100',
  regulatory: 'text-red-600 bg-red-100',
  protocol: 'text-blue-600 bg-blue-100',
  data: 'text-green-600 bg-green-100',
  safety: 'text-orange-600 bg-orange-100'
}

export default function IssueDetailPage({ params }: { params: { id: string } }) {
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (!newComment.trim()) return
    // Would submit to API
    console.log("Adding comment:", newComment)
    setNewComment("")
  }

  const handleStatusChange = () => {
    // Would update via API
    console.log("Changing status")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/issues" className="hover:text-gray-700">Issues</Link>
        <span>/</span>
        <span>#{issue.id}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Issue Header */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-green-500 mt-1" />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{issue.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>#{issue.id}</span>
                    <span>opened {formatRelativeTime(issue.createdAt)} by {issue.author}</span>
                    <span>• {issue.comments.length} comments</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant={issue.status === 'open' ? 'destructive' : 'default'} 
                    size="sm"
                    onClick={handleStatusChange}
                  >
                    {issue.status === 'open' ? (
                      <>
                        <Lock className="w-4 h-4 mr-1" />
                        Close issue
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 mr-1" />
                        Reopen issue
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Issue Description */}
            <div className="p-6">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-900">
                  {issue.description}
                </pre>
              </div>
              
              {/* Attachments */}
              {issue.attachments.length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Attachments</h4>
                  <div className="space-y-2">
                    {issue.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <Link href="#" className="text-blue-600 hover:underline">
                          {attachment}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            {issue.comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg border">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {comment.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">
                      commented {formatRelativeTime(comment.timestamp)}
                    </span>
                    {comment.type === 'system' && (
                      <Badge variant="secondary" className="text-xs">System</Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="prose max-w-none text-sm">
                    <p>{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="bg-white rounded-lg border">
            <div className="p-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave a comment..."
                className="w-full h-32 p-3 border rounded-md resize-none"
              />
              <div className="flex justify-end space-x-2 mt-3">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-gray-900 mb-3">Status</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={issue.status === 'open' ? 'success' : 'secondary'}>
                  {issue.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Priority:</span>
                <Badge className={priorityColors[issue.priority]}>
                  {issue.priority}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Type:</span>
                <Badge className={typeColors[issue.type]}>
                  {issue.type}
                </Badge>
              </div>
            </div>
          </div>

          {/* Assignees */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-gray-900 mb-3">Assignees</h3>
            {issue.assignee ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  {issue.assignee.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm text-gray-900">{issue.assignee}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No one assigned</p>
            )}
            <Button variant="outline" size="sm" className="w-full mt-2">
              <User className="w-4 h-4 mr-1" />
              Assign
            </Button>
          </div>

          {/* Labels */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-gray-900 mb-3">Labels</h3>
            <div className="flex flex-wrap gap-1 mb-2">
              {issue.labels.map((label) => (
                <Badge key={label} variant="outline" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Tag className="w-4 h-4 mr-1" />
              Edit labels
            </Button>
          </div>

          {/* Related PRs */}
          {issue.relatedPRs.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-medium text-gray-900 mb-3">Related Pull Requests</h3>
              <div className="space-y-2">
                {issue.relatedPRs.map((prId) => (
                  <Link 
                    key={prId}
                    href={`/pull-requests/${prId}`}
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:underline"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>#{prId}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span>{formatRelativeTime(issue.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Updated:</span>
                <span>{formatRelativeTime(issue.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}