"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Play
} from 'lucide-react'

interface MetricCard {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
}

const metrics: MetricCard[] = [
  {
    title: "Synthetic Twins",
    value: 847,
    change: "+12%",
    changeType: "positive",
    icon: <Users className="w-5 h-5" />
  },
  {
    title: "Power Analysis",
    value: "94.2%",
    change: "+2.1%", 
    changeType: "positive",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    title: "Protocol Version",
    value: "v2.1",
    change: "Updated 2h ago",
    changeType: "neutral",
    icon: <Activity className="w-5 h-5" />
  },
  {
    title: "Validation Status",
    value: "Passed",
    change: "All checks ✓",
    changeType: "positive", 
    icon: <CheckCircle className="w-5 h-5" />
  }
]

const simulationResults = {
  recruitment: {
    estimated: "18 months",
    confidence: "85%",
    sites: 12
  },
  demographics: {
    age: "62.4 ± 11.2",
    gender: "52% F / 48% M",
    ethnicity: "68% White, 22% Asian, 10% Other"
  },
  outcomes: {
    primaryEndpoint: "Safety (95% CI: 88-97%)",
    secondaryEndpoint: "ORR 23% (95% CI: 18-28%)",
    dropoutRate: "12%"
  }
}

export function TrialDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)

  // Load dashboard data on mount
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to load dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadDashboard()
  }, [])

  const handleRunSimulation = async () => {
    setSimulating(true)
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ n: 100 }),
      })
      
      const result = await response.json()
      console.log('Simulation result:', result)
      
      // Reload dashboard data after simulation
      const dashResponse = await fetch('/api/dashboard')
      const dashData = await dashResponse.json()
      setDashboardData(dashData)
    } catch (error) {
      console.error('Failed to run simulation:', error)
    } finally {
      setSimulating(false)
    }
  }

  const getChangeColor = (type?: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  const displayMetrics = dashboardData?.metrics || metrics
  const displaySimulationResults = dashboardData?.simulationResults || simulationResults

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trial Dashboard</h1>
          <p className="text-gray-600">NSCLC Phase I Trial - CTP-ABC123</p>
        </div>
        <Button onClick={handleRunSimulation} disabled={simulating}>
          <Play className="w-4 h-4 mr-2" />
          {simulating ? 'Running...' : 'Run New Simulation'}
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayMetrics.map((metric: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                {metric.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                {metric.change && (
                  <p className={`text-sm mt-1 ${getChangeColor(metric.changeType)}`}>
                    {metric.change}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simulation Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recruitment Forecast</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Duration</span>
              <span className="font-medium text-gray-900">{displaySimulationResults.recruitment.estimated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Confidence Level</span>
              <span className="font-medium text-gray-900">{displaySimulationResults.recruitment.confidence}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Contributing Sites</span>
              <span className="font-medium text-gray-900">{displaySimulationResults.recruitment.sites}</span>
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Patient Demographics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mean Age</span>
              <span className="font-medium text-gray-900">{displaySimulationResults.demographics.age}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Gender Split</span>
              <span className="font-medium text-gray-900">{displaySimulationResults.demographics.gender}</span>
            </div>
            <div className="pt-2">
              <span className="text-sm text-gray-600">Ethnicity</span>
              <p className="text-sm font-medium mt-1 text-gray-900 leading-relaxed">{displaySimulationResults.demographics.ethnicity}</p>
            </div>
          </div>
        </div>

        {/* Outcomes */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">Predicted Outcomes</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Primary Endpoint</span>
              <p className="text-sm font-medium mt-1 text-gray-900">{displaySimulationResults.outcomes.primaryEndpoint}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Secondary Endpoint</span>
              <p className="text-sm font-medium mt-1 text-gray-900">{displaySimulationResults.outcomes.secondaryEndpoint}</p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-600">Predicted Dropout</span>
              <span className="font-medium text-gray-900">{displaySimulationResults.outcomes.dropoutRate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diversity Badge */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Diversity Assessment</h3>
          </div>
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium w-fit">
            Silver Badge
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-amber-600 mb-1">68%</div>
            <div className="text-sm text-gray-600">Ethnic Diversity Score</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-1">85%</div>
            <div className="text-sm text-gray-600">Geographic Coverage</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-1">52%</div>
            <div className="text-sm text-gray-600">Gender Balance</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
          Consider expanding outreach to underrepresented communities to achieve Gold badge status.
        </p>
      </div>
    </div>
  )
}