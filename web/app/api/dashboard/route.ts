import { NextResponse } from 'next/server'

// Mock dashboard data - in a real implementation this would come from bst simulation results
export async function GET() {
  try {
    const dashboardData = {
      metrics: [
        {
          title: "Synthetic Twins",
          value: 847,
          change: "+12%",
          changeType: "positive",
          icon: "Users"
        },
        {
          title: "Power Analysis",
          value: "94.2%",
          change: "+2.1%", 
          changeType: "positive",
          icon: "TrendingUp"
        },
        {
          title: "Protocol Version",
          value: "v2.1",
          change: "Updated 2h ago",
          changeType: "neutral",
          icon: "Activity"
        },
        {
          title: "Validation Status",
          value: "Passed",
          change: "All checks ✓",
          changeType: "positive", 
          icon: "CheckCircle"
        }
      ],
      simulationResults: {
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
      },
      diversityAssessment: {
        badge: "Silver Badge",
        scores: {
          ethnicDiversity: 68,
          geographicCoverage: 85,
          genderBalance: 52
        }
      }
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}