"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  Plus, 
  Check, 
  Clock,
  Users,
  MessageSquare
} from 'lucide-react'

interface Commit {
  id: string
  message: string
  author: string
  timestamp: string
  branch: string
}

interface PullRequest {
  id: number
  title: string
  author: string
  status: 'open' | 'closed' | 'merged'
  timestamp: string
  description: string
  commits: number
  comments: number
}

const mockCommits: Commit[] = [
  {
    id: "a1b2c3d",
    message: "add synthetic control twins (n=50)",
    author: "Dr. Smith",
    timestamp: "2 hours ago",
    branch: "main"
  },
  {
    id: "e4f5g6h",
    message: "add protocol demo_protocol.yaml",
    author: "Dr. Smith", 
    timestamp: "3 hours ago",
    branch: "main"
  },
  {
    id: "i7j8k9l",
    message: "scaffold trial for NSCLC",
    author: "Dr. Smith",
    timestamp: "4 hours ago", 
    branch: "main"
  }
]

const mockPullRequests: PullRequest[] = [
  {
    id: 12,
    title: "Add Japan sites to protocol",
    author: "Dr. Tanaka",
    status: "open",
    timestamp: "1 day ago",
    description: "Adding 3 additional sites in Japan for Phase II expansion",
    commits: 3,
    comments: 2
  },
  {
    id: 11,
    title: "Update eligibility criteria for elderly patients",
    author: "Dr. Johnson",
    status: "merged",
    timestamp: "3 days ago", 
    description: "Lowering minimum age from 18 to 16 based on IRB feedback",
    commits: 1,
    comments: 5
  }
]

export function GitWorkflow() {
  const [commitMessage, setCommitMessage] = useState("")
  const [isCommitting, setIsCommitting] = useState(false)

  const handleCommit = async () => {
    if (!commitMessage.trim()) return
    
    setIsCommitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsCommitting(false)
    setCommitMessage("")
    
    // In real implementation, would call git API
    console.log("Committing:", commitMessage)
  }

  const getStatusIcon = (status: PullRequest['status']) => {
    switch (status) {
      case 'open':
        return <GitPullRequest className="w-4 h-4 text-green-500" />
      case 'merged':
        return <Check className="w-4 h-4 text-purple-500" />
      case 'closed':
        return <GitPullRequest className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: PullRequest['status']) => {
    switch (status) {
      case 'open':
        return 'text-green-700 bg-green-100'
      case 'merged':
        return 'text-purple-700 bg-purple-100'
      case 'closed':
        return 'text-gray-700 bg-gray-100'
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <GitBranch className="w-5 h-5 mr-2" />
          Version Control
        </h2>
      </div>

      <Tabs defaultValue="commits" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 w-fit">
          <TabsTrigger value="commits">
            <GitCommit className="w-4 h-4 mr-2" />
            Commits
          </TabsTrigger>
          <TabsTrigger value="pull-requests">
            <GitPullRequest className="w-4 h-4 mr-2" />
            Pull Requests
          </TabsTrigger>
          <TabsTrigger value="new-commit">
            <Plus className="w-4 h-4 mr-2" />
            New Commit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commits" className="flex-1 p-4">
          <div className="space-y-3">
            {mockCommits.map((commit) => (
              <div key={commit.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <GitCommit className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{commit.message}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 flex items-center space-x-4">
                      <span>by {commit.author}</span>
                      <span>{commit.timestamp}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {commit.branch}
                      </span>
                    </div>
                  </div>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {commit.id}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pull-requests" className="flex-1 p-4">
          <div className="space-y-3">
            {mockPullRequests.map((pr) => (
              <div key={pr.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(pr.status)}
                      <span className="font-medium">{pr.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pr.status)}`}>
                        {pr.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{pr.description}</p>
                    <div className="mt-2 text-sm text-gray-600 flex items-center space-x-4">
                      <span>by {pr.author}</span>
                      <span>{pr.timestamp}</span>
                      <div className="flex items-center space-x-2">
                        <GitCommit className="w-3 h-3" />
                        <span>{pr.commits} commits</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-3 h-3" />
                        <span>{pr.comments} comments</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">#{pr.id}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new-commit" className="flex-1 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Commit Message
              </label>
              <textarea
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Add a descriptive commit message..."
                className="w-full h-24 p-3 border rounded-md resize-none"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Changed Files</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  <span>protocol/main_protocol.yaml</span>
                  <span className="text-green-600">+12 -3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  <span>data/synthetic-controls.parquet</span>
                  <span className="text-blue-600">modified</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCommit} 
              disabled={!commitMessage.trim() || isCommitting}
              className="w-full"
            >
              {isCommitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Committing...
                </>
              ) : (
                <>
                  <GitCommit className="w-4 h-4 mr-2" />
                  Commit Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}