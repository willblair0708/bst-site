"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Folder, 
  Download, 
  Eye,
  Edit,
  Clock,
  Users,
  GitBranch,
  FileCode,
  Database,
  Image,
  Plus,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: string
  lastModified: string
  author: string
  message: string
  icon: React.ComponentType<{ className?: string }>
}

const fileStructure: FileItem[] = [
  {
    name: "protocol",
    type: "folder",
    lastModified: "2024-01-20T08:30:00Z",
    author: "Dr. Johnson",
    message: "Update protocol v2.1 with amended criteria",
    icon: Folder
  },
  {
    name: "data",
    type: "folder", 
    lastModified: "2024-01-19T15:45:00Z",
    author: "System",
    message: "Add synthetic control twins batch #847",
    icon: Folder
  },
  {
    name: "documents",
    type: "folder",
    lastModified: "2024-01-18T12:20:00Z", 
    author: "Dr. Chen",
    message: "Upload IRB approval documents",
    icon: Folder
  },
  {
    name: "scripts",
    type: "folder",
    lastModified: "2024-01-17T09:15:00Z",
    author: "Dr. Martinez",
    message: "Add data analysis scripts",
    icon: Folder
  },
  {
    name: "README.md",
    type: "file",
    size: "3.2 KB",
    lastModified: "2024-01-16T14:30:00Z",
    author: "Dr. Johnson", 
    message: "Update study overview and objectives",
    icon: FileText
  },
  {
    name: "CHANGELOG.md",
    type: "file",
    size: "1.8 KB",
    lastModified: "2024-01-15T11:00:00Z",
    author: "Dr. Johnson",
    message: "Document protocol amendments",
    icon: FileText
  },
  {
    name: "bastion.yaml",
    type: "file", 
    size: "892 B",
    lastModified: "2024-01-14T16:45:00Z",
    author: "Dr. Martinez",
    message: "Configure trial settings",
    icon: FileCode
  }
]

const breadcrumb = [
  { name: "CTP-ABC123", href: "/files" },
  { name: "root", href: "/files" }
]

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFiles = fileStructure.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return <Folder className="w-5 h-5 text-blue-500" />
    
    const extension = file.name.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'md':
        return <FileText className="w-5 h-5 text-gray-600" />
      case 'yaml':
      case 'yml':
        return <FileCode className="w-5 h-5 text-green-600" />
      case 'csv':
      case 'parquet':
        return <Database className="w-5 h-5 text-orange-600" />
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image className="w-5 h-5 text-purple-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Files</h1>
          <nav className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item.name}>
                {index > 0 && <span>/</span>}
                <Link href={item.href} className="hover:text-gray-700">
                  {item.name}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <GitBranch className="w-4 h-4 mr-1" />
            main
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add file
          </Button>
        </div>
      </div>

      {/* File Browser */}
      <div className="bg-white rounded-lg border">
        {/* Search and Controls */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border rounded-md text-sm w-64"
                />
              </div>
              <div className="text-sm text-gray-600">
                {filteredFiles.length} items
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download ZIP
              </Button>
            </div>
          </div>
        </div>

        {/* File List Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-600">
          <div className="col-span-6">Name</div>
          <div className="col-span-3">Last commit message</div>
          <div className="col-span-2">Last updated</div>
          <div className="col-span-1">Size</div>
        </div>

        {/* File List */}
        <div className="divide-y">
          {filteredFiles.map((file, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 group">
              <div className="col-span-6 flex items-center space-x-3">
                {getFileIcon(file)}
                <Link 
                  href={file.type === 'folder' ? `/files/${file.name}` : `/files/view/${file.name}`}
                  className="font-medium text-blue-600 hover:underline flex-1"
                >
                  {file.name}
                </Link>
                {file.type === 'file' && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="col-span-3 text-sm text-gray-600 truncate">
                {file.message}
              </div>
              <div className="col-span-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>{file.author}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(file.lastModified)}</span>
                </div>
              </div>
              <div className="col-span-1 text-sm text-gray-500">
                {file.size || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Protocol Files</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Current protocol version with all amendments and regulatory submissions.
          </p>
          <Link href="/files/protocol">
            <Button variant="outline" size="sm" className="w-full">
              Browse Protocol →
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">Trial Data</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Synthetic control twins, patient data, and simulation results.
          </p>
          <Link href="/files/data">
            <Button variant="outline" size="sm" className="w-full">
              Browse Data →
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3 mb-4">
            <FileCode className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Analysis Scripts</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Statistical analysis code, simulation scripts, and data processing tools.
          </p>
          <Link href="/files/scripts">
            <Button variant="outline" size="sm" className="w-full">
              Browse Scripts →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}