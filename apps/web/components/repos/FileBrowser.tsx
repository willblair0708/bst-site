"use client"
import { useState, useEffect } from 'react'
import { ChevronRight, File, Folder, ChevronDown } from 'lucide-react'
import { FileNode } from '@/lib/types'

interface Props {
  slug: string
  onFileSelect?: (path: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function TreeNode({ 
  node, 
  level = 0, 
  onFileSelect,
  expandedPaths,
  onToggleExpand
}: { 
  node: FileNode
  level?: number
  onFileSelect?: (path: string) => void
  expandedPaths: Set<string>
  onToggleExpand: (path: string) => void
}) {
  const isExpanded = expandedPaths.has(node.path)
  const isFile = node.type === 'file'
  
  const handleClick = () => {
    if (isFile) {
      onFileSelect?.(node.path)
    } else {
      onToggleExpand(node.path)
    }
  }

  const fileName = node.path.split('/').pop() || node.path

  return (
    <div>
      <div
        className="flex items-center py-2 px-3 hover:bg-primary-50 cursor-pointer group rounded-xl transition-all duration-200 mx-1"
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center flex-1 min-w-0 gap-2">
          {!isFile && (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-primary-600" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-primary-600" />
              )}
            </div>
          )}
          <div className="flex-shrink-0">
            {isFile ? (
              <div className="w-4 h-4 bg-primary-100 rounded-md flex items-center justify-center">
                <File className="w-2.5 h-2.5 text-primary-600" />
              </div>
            ) : (
              <div className="w-4 h-4 bg-accent-100 rounded-md flex items-center justify-center">
                <Folder className="w-2.5 h-2.5 text-accent-600" />
              </div>
            )}
          </div>
          <span className="truncate text-sm font-medium text-primary-800 group-hover:text-primary-900">
            {fileName}
          </span>
        </div>
        {isFile && node.size !== undefined && (
          <div className="bg-primary-100/50 px-2 py-0.5 rounded-lg">
            <span className="text-xs font-medium text-primary-700">
              {formatFileSize(node.size)}
            </span>
          </div>
        )}
      </div>
      
      {!isFile && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              expandedPaths={expandedPaths}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileBrowser({ slug, onFileSelect }: Props) {
  const [tree, setTree] = useState<FileNode | null>(null)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['/']))

  useEffect(() => {
    fetch(`/api/repos/${slug}/files`)
      .then((r) => r.json())
      .then((d) => setTree(d?.tree))
  }, [slug])

  const handleToggleExpand = (path: string) => {
    const newExpanded = new Set(expandedPaths)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedPaths(newExpanded)
  }

  if (!tree) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-primary-700">Loading files...</div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="bg-primary-50/50 px-6 py-4 border-b border-primary-200/30">
        <h3 className="font-display font-semibold text-primary-900 flex items-center gap-2">
          <div className="w-5 h-5 bg-primary-500 rounded-lg flex items-center justify-center">
            📁
          </div>
          Files
        </h3>
      </div>
      <div className="max-h-96 overflow-y-auto p-2">
        {tree.children?.map((child) => (
          <TreeNode
            key={child.path}
            node={child}
            onFileSelect={onFileSelect}
            expandedPaths={expandedPaths}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>
    </div>
  )
}
