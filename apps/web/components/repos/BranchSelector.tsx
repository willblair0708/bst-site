"use client"
import { ChevronDown, GitBranch, Tag } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Branch {
  name: string
  isDefault: boolean
  lastCommit: string
  behind: number
  ahead: number
}

interface Tag {
  name: string
  sha: string
  createdAt: string
}

interface Props {
  branches: Branch[]
  tags: Tag[]
  currentBranch: string
  onBranchChange: (branch: string) => void
}

export function BranchSelector({ branches, tags, currentBranch, onBranchChange }: Props) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeTab, setActiveTab] = useState<'branches' | 'tags'>('branches')

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowDropdown(!showDropdown)}
        className="soft-ui bg-white/80 border-primary-300/50 hover:bg-primary-50 rounded-xl font-mono text-sm transition-all duration-200 hover:scale-105"
      >
        <GitBranch className="w-4 h-4 mr-2 text-primary-600" />
        {currentBranch}
        <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
      </Button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-3 w-80 bg-white/90 backdrop-blur-sm border border-primary-200/30 rounded-2xl shadow-elevation-4 z-50 overflow-hidden">
          <div className="flex bg-primary-50/50">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === 'branches' 
                  ? 'bg-primary-500 text-white rounded-tl-2xl' 
                  : 'text-primary-700 hover:bg-primary-100'
              }`}
              onClick={() => setActiveTab('branches')}
            >
              Branches ({branches.length})
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === 'tags' 
                  ? 'bg-primary-500 text-white rounded-tr-2xl' 
                  : 'text-primary-700 hover:bg-primary-100'
              }`}
              onClick={() => setActiveTab('tags')}
            >
              Tags ({tags.length})
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto p-3">
            {activeTab === 'branches' && (
              <div className="space-y-2">
                {branches.map((branch) => (
                  <button
                    key={branch.name}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 text-left transition-all duration-200 hover:scale-102"
                    onClick={() => {
                      onBranchChange(branch.name)
                      setShowDropdown(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center">
                        <GitBranch className="w-3.5 h-3.5 text-primary-600" />
                      </div>
                      <div>
                        <span className="font-mono text-sm font-medium text-foreground">{branch.name}</span>
                        {branch.isDefault && (
                          <div className="mt-0.5">
                            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-accent-100 text-accent-700 rounded-full font-medium">
                              default
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {(branch.ahead > 0 || branch.behind > 0) && (
                      <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                        {branch.ahead > 0 && `+${branch.ahead}`}
                        {branch.behind > 0 && ` -${branch.behind}`}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'tags' && (
              <div className="space-y-2">
                {tags.map((tag) => (
                  <button
                    key={tag.name}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 text-left transition-all duration-200 hover:scale-102"
                    onClick={() => {
                      onBranchChange(tag.name)
                      setShowDropdown(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-accent-100 rounded-lg flex items-center justify-center">
                        <Tag className="w-3.5 h-3.5 text-accent-600" />
                      </div>
                      <span className="font-mono text-sm font-medium text-foreground">{tag.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                      {new Date(tag.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
