"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  GitFork,
  Star,
  Activity,
  Users,
  Database,
  Shield
} from 'lucide-react'

export default function EvidencePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Evidence Dashboard</h1>
          <p className="text-gray-600">Live safety signals, reproducibility checks, and computable evidence</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Safety Signals</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reproduced Studies</p>
                <p className="text-2xl font-bold text-green-600">847</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Models</p>
                <p className="text-2xl font-bold text-blue-600">124</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contributors</p>
                <p className="text-2xl font-bold text-purple-600">1,247</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Safety Alerts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Live Safety Board</h2>
              <Badge variant="outline" className="text-red-600 border-red-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                3 new signals
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-red-900">Pembrolizumab + Hepatotoxicity</h3>
                  <Badge className="bg-red-100 text-red-800">URGENT</Badge>
                </div>
                <p className="text-sm text-red-700 mb-2">
                  4 new FAERS reports in 72h. Potential signal in melanoma + immunotherapy combinations.
                </p>
                <div className="flex items-center text-xs text-red-600">
                  <Clock className="w-3 h-3 mr-1" />
                  Updated 2 hours ago
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-yellow-900">CAR-T Cell Therapy CRS</h3>
                  <Badge className="bg-yellow-100 text-yellow-800">WATCH</Badge>
                </div>
                <p className="text-sm text-yellow-700 mb-2">
                  Elevated cytokine release syndrome rates in pediatric populations across 3 centers.
                </p>
                <div className="flex items-center text-xs text-yellow-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending up 15%
                </div>
              </div>
            </div>
          </Card>

          {/* Reproducibility CI Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Reproducibility CI</h2>
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                87% passing
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-900">mitochondrial-ros-sensor</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm text-green-700 mb-2">
                  All figures reproduced within 2% tolerance. No dependency drift detected.
                </p>
                <div className="flex items-center justify-between text-xs text-green-600">
                  <div className="flex items-center">
                    <GitFork className="w-3 h-3 mr-1" />
                    12 forks
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    47 stars
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-900">variant-insight-brca1</span>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-sm text-red-700 mb-2">
                  Figure 3B drift detected. New gnomAD release changed variant frequencies.
                </p>
                <div className="flex items-center justify-between text-xs text-red-600">
                  <div className="flex items-center">
                    <Activity className="w-3 h-3 mr-1" />
                    Fix PR #47 open
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    3 days ago
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Evidence Activity</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">@chen-lab</span> published new dataset card: 
                  <span className="font-medium text-blue-600"> single-cell-alzheimer-atlas</span>
                </p>
                <p className="text-xs text-gray-500">10k cells, RNA-seq + ATAC-seq, DOI minted</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">@patient-advocate-group</span> successfully reproduced findings from 
                  <span className="font-medium text-green-600"> cardiac-ai-biomarker</span>
                </p>
                <p className="text-xs text-gray-500">Cross-validation AUC: 0.87 (vs 0.89 reported)</p>
                <p className="text-xs text-gray-400">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">@fda-reviewer</span> flagged potential bias in 
                  <span className="font-medium text-yellow-600"> covid-severity-predictor</span>
                </p>
                <p className="text-xs text-gray-500">Age distribution skewed in training data</p>
                <p className="text-xs text-gray-400">6 hours ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}