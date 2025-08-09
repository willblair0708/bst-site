"use client"
import { GitCommit, User } from 'lucide-react'
import Image from 'next/image'

interface Commit {
  id: string
  message: string
  author: string
  authorEmail: string
  timestamp: string
  sha: string
}

interface Props {
  commits: Commit[]
}

function timeAgo(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) return 'just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return then.toLocaleDateString()
}

export function CommitHistory({ commits }: Props) {
  return (
    <div className="overflow-hidden">
      <div className="bg-accent-50/50 px-6 py-4 border-b border-accent-200/30">
        <h3 className="font-display font-semibold text-accent-900 flex items-center gap-2">
          <div className="w-5 h-5 bg-accent-500 rounded-lg flex items-center justify-center">
            📝
          </div>
          Recent commits
        </h3>
      </div>
      <div className="divide-y divide-accent-200/30">
        {commits.map((commit) => (
          <div key={commit.id} className="p-4 hover:bg-accent-50/30 transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center shadow-soft">
                <User className="w-5 h-5 text-accent-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <span className="font-medium text-sm text-accent-900 leading-relaxed">{commit.message}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-accent-700 font-medium">{commit.author}</span>
                  <div className="flex items-center gap-1.5">
                    <GitCommit className="w-3 h-3 text-accent-600" />
                    <code className="font-mono bg-accent-100 text-accent-800 px-2 py-0.5 rounded-lg font-medium">
                      {commit.sha.slice(0, 7)}
                    </code>
                  </div>
                  <span className="text-accent-600">{timeAgo(commit.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
