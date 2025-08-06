"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Editor from '@monaco-editor/react'
import { 
  FileText,
  Download,
  Edit,
  History,
  Eye,
  Code,
  GitBranch,
  Users,
  Clock,
  Copy,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

interface FileHistoryItem {
  sha: string
  message: string
  author: string
  timestamp: string
  additions: number
  deletions: number
}

interface FileViewerProps {
  filename: string
  content: string
  language: string
  size: string
  lastModified: string
  author: string
  branch: string
  history: FileHistoryItem[]
  isEditable?: boolean
}

const mockFileHistory: FileHistoryItem[] = [
  {
    sha: 'a1b2c3d',
    message: 'Update eligibility criteria for elderly patients',
    author: 'Dr. Johnson',
    timestamp: '2024-01-20T14:30:00Z',
    additions: 12,
    deletions: 3
  },
  {
    sha: 'e4f5g6h',
    message: 'Add biomarker collection timepoints',
    author: 'Dr. Chen',
    timestamp: '2024-01-19T16:45:00Z',
    additions: 25,
    deletions: 5
  },
  {
    sha: 'i7j8k9l',
    message: 'Initial protocol setup',
    author: 'Dr. Johnson',
    timestamp: '2024-01-15T09:00:00Z',
    additions: 247,
    deletions: 0
  }
]

const sampleProtocolContent = `id: CTP-ABC123
title: "NSCLC Phase I Safety and Efficacy Trial"
version: "v2.1"
phase: "I"

study_design:
  type: "open-label"
  allocation: "single-arm"
  intervention_model: "dose-escalation"
  
inclusion_criteria:
  - "Age 18-75 years"
  - "Histologically confirmed advanced NSCLC"
  - "ECOG Performance Status 0-1"
  - "Adequate organ function"
  - "Life expectancy ≥ 12 weeks"

exclusion_criteria:
  - "Prior immunotherapy"
  - "Active autoimmune disease"
  - "CNS metastases (unless treated and stable)"
  - "Significant cardiovascular disease"

endpoints:
  primary:
    - "Safety and tolerability"
    - "Maximum tolerated dose (MTD)"
  secondary:
    - "Overall response rate (ORR)"
    - "Progression-free survival (PFS)"
    - "Pharmacokinetics"

sites:
  - name: "Memorial Sloan Kettering"
    country: "United States"
    pi: "Dr. Sarah Johnson"
    contact: "sarah.johnson@mskcc.org"
  - name: "Johns Hopkins"
    country: "United States" 
    pi: "Dr. Michael Chen"
    contact: "mchen@jhmi.edu"

biomarkers:
  collection_timepoints:
    - "Baseline (C1D1)"
    - "C1D15"
    - "C2D1"
    - "End of Treatment"
  sample_types:
    - "Plasma"
    - "Serum"
    - "PBMC"
  analyses:
    - "Cytokine panel"
    - "Immune cell profiling"
    - "Circulating tumor DNA"`

export function FileViewer({ 
  filename = "protocol/main_protocol.yaml",
  content = sampleProtocolContent,
  language = "yaml",
  size = "3.2 KB",
  lastModified = "2024-01-20T14:30:00Z",
  author = "Dr. Johnson",
  branch = "main",
  history = mockFileHistory,
  isEditable = true
}: FileViewerProps) {
  const [activeTab, setActiveTab] = useState("content")
  const [lineNumbers, setLineNumbers] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy content:', err)
    }
  }

  const getLanguageIcon = (lang: string) => {
    switch (lang) {
      case 'yaml':
      case 'yml':
        return <Code className="w-4 h-4 text-green-600" />
      case 'markdown':
      case 'md':
        return <FileText className="w-4 h-4 text-blue-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* File Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getLanguageIcon(language)}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{filename}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>{size}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatRelativeTime(lastModified)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <GitBranch className="w-4 h-4" />
                  <span>{branch}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            {isEditable && (
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1" />
              Raw
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6 pt-4">
          <TabsList>
            <TabsTrigger value="content">
              <Eye className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              History ({history.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="content" className="px-6 pb-6">
          {/* Editor Options */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-xs">
                {language.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-500">
                {content.split('\n').length} lines
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={lineNumbers}
                  onChange={(e) => setLineNumbers(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Line numbers</span>
              </label>
            </div>
          </div>

          {/* File Content */}
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="600px"
              language={language}
              value={content}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                lineNumbers: lineNumbers ? 'on' : 'off',
                renderWhitespace: 'selection',
                folding: true,
                formatOnType: true,
                formatOnPaste: true
              }}
              theme="vs-light"
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="px-6 pb-6">
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={item.sha} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <GitBranch className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{item.message}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{item.author}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(item.timestamp)}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">+{item.additions}</span>
                        <span className="text-red-600">-{item.deletions}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {item.sha}
                    </code>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}