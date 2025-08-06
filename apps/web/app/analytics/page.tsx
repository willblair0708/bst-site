"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3,
  Users,
  AlertTriangle,
  FileText,
  Download,
  Filter,
  Cpu
} from 'lucide-react'

const kpiData = [
    { title: "Enrolled Patients", value: "84 / 150", trend: "+5 this week", status: "on_track" },
    { title: "Data Quality Score", value: "98.2%", trend: "-0.1% vs last week", status: "on_track" },
    { title: "Power (Simulated)", value: "89.7%", trend: "Stable", status: "on_track" },
    { title: "SAE Rate", value: "1.2%", trend: "+0.5% vs last week", status: "alert" }
]

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 border-b border-border flex items-center justify-between">
        {children}
    </div>
)

const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-base font-semibold text-foreground">{children}</h2>
)

const KpiCard = ({ title, value, trend, status }: { title: string; value: string; trend: string; status: string }) => (
    <Card>
        <div className="p-4">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
            <div className="flex items-center text-xs mt-2">
                <span className={status === 'alert' ? 'text-destructive' : 'text-green-400'}>{trend}</span>
            </div>
        </div>
    </Card>
)

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-1">CTP-ABC123: NSCLC Phase I Safety Trial</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
                <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
            </div>
        </div>

      <Tabs defaultValue="overview">
        <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="digital-twin">Digital Twin</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>
            <Card>
                <CardHeader><CardTitle>Enrollment Rate</CardTitle></CardHeader>
                <div className="p-4 h-80 flex items-center justify-center text-muted-foreground">
                    {/* Placeholder for chart */}
                    Enrollment chart coming soon.
                </div>
            </Card>
        </TabsContent>
        {/* Other Tabs content would go here */}
      </Tabs>
    </div>
  )
}
