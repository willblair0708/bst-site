"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Activity,
  FileText,
  Users,
  Database,
  CheckCircle
} from 'lucide-react'

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Safety Monitoring</h1>
          <p className="text-gray-600">Real-time pharmacovigilance and safety signal detection across all studies</p>
        </div>

        {/* Alert Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">New Safety Signal Detected</h3>
              <p className="text-sm text-red-700 mt-1">
                Elevated hepatotoxicity reports for pembrolizumab combinations. 
                <a href="#signal-detail" className="font-medium underline">Review immediately</a>
              </p>
            </div>
            <Badge className="bg-red-100 text-red-800">URGENT</Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Signals</p>
                <p className="text-2xl font-bold text-red-600">7</p>
                <p className="text-xs text-gray-500">+2 this week</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">FAERS Reports</p>
                <p className="text-2xl font-bold text-blue-600">2,847</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monitored Trials</p>
                <p className="text-2xl font-bold text-green-600">89</p>
                <p className="text-xs text-gray-500">Across 12 sponsors</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-purple-600">4.2h</p>
                <p className="text-xs text-gray-500">Avg to review</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Safety Signals */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Active Safety Signals</h2>
                <Badge variant="outline">Live Feed</Badge>
              </div>
              
              <div className="space-y-4">
                <div id="signal-detail" className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-red-900">Pembrolizumab + Hepatotoxicity</h3>
                      <p className="text-sm text-red-700">Immune checkpoint inhibitor combinations</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-red-600">URGENT</Badge>
                      <p className="text-xs text-red-600 mt-1">Signal strength: 8.7</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-red-800 font-medium">New Reports</p>
                      <p className="text-red-700">4 in 72h</p>
                    </div>
                    <div>
                      <p className="text-red-800 font-medium">Total Cases</p>
                      <p className="text-red-700">23 this month</p>
                    </div>
                    <div>
                      <p className="text-red-800 font-medium">ROR</p>
                      <p className="text-red-700">3.4 (CI: 2.1-5.6)</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-red-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending up 40% vs baseline
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-yellow-900">CAR-T Cell Therapy CRS</h3>
                      <p className="text-sm text-yellow-700">Cytokine release syndrome monitoring</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-yellow-600">WATCH</Badge>
                      <p className="text-xs text-yellow-600 mt-1">Signal strength: 4.2</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-yellow-800 font-medium">New Reports</p>
                      <p className="text-yellow-700">7 in 7d</p>
                    </div>
                    <div>
                      <p className="text-yellow-800 font-medium">Pediatric Focus</p>
                      <p className="text-yellow-700">85% under 18</p>
                    </div>
                    <div>
                      <p className="text-yellow-800 font-medium">Severity</p>
                      <p className="text-yellow-700">Grade 3+ (60%)</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-green-900">Checkpoint Inhibitor Pneumonitis</h3>
                      <p className="text-sm text-green-700">Previously elevated signal</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-600">RESOLVED</Badge>
                      <p className="text-xs text-green-600 mt-1">Signal strength: 1.8</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-green-800 font-medium">Trend</p>
                      <p className="text-green-700">Declining</p>
                    </div>
                    <div>
                      <p className="text-green-800 font-medium">Mitigation</p>
                      <p className="text-green-700">Protocol updated</p>
                    </div>
                    <div>
                      <p className="text-green-800 font-medium">Status</p>
                      <p className="text-green-700 flex items-center">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        -60%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Data Sources */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Live Data Sources</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">FDA FAERS</span>
                  </div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">EMA EudraVigilance</span>
                  </div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">Trial Safety Reports</span>
                  </div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">Social Signals</span>
                  </div>
                  <span className="text-xs text-gray-500">Beta</span>
                </div>
              </div>
            </Card>

            {/* Recent Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Actions</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900">Signal reviewed</p>
                    <p className="text-xs text-gray-500">CAR-T CRS - 2h ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900">New signal created</p>
                    <p className="text-xs text-gray-500">Pembrolizumab - 4h ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900">Protocol updated</p>
                    <p className="text-xs text-gray-500">CTP-ABC123 - 1d ago</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Reports</span>
                  <span className="text-sm font-medium text-gray-900">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Signals Created</span>
                  <span className="text-sm font-medium text-gray-900">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Signals Resolved</span>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="text-sm font-medium text-gray-900">3.8h</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}