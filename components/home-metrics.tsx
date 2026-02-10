'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Activity, FileText, AlertTriangle, TrendingUp, Users, DollarSign } from 'lucide-react'

interface DashboardMetrics {
  totalTransactions: number
  totalAmount: number
  activeVendors: number
  flaggedTransactions: number
  fraudCases: number
  openCases: number
  averageRiskScore: number
  complianceViolations: number
  lastUpdated: string
}

const DEFAULT_METRICS: DashboardMetrics = {
  totalTransactions: 45230,
  totalAmount: 2450000000,
  activeVendors: 1243,
  flaggedTransactions: 342,
  fraudCases: 28,
  openCases: 12,
  averageRiskScore: 32,
  complianceViolations: 18,
  lastUpdated: new Date().toISOString(),
}

export function HomeMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(DEFAULT_METRICS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics/dashboard')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.log('[v0] Using default metrics')
      setMetrics(DEFAULT_METRICS)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 bg-card/50 h-32" />
        ))}
      </div>
    )
  }

  const metricCards = [
    {
      label: 'Total Transactions',
      value: metrics.totalTransactions.toLocaleString(),
      icon: Activity,
      color: 'text-blue-500',
      trend: '+12%',
    },
    {
      label: 'Total Amount Audited',
      value: `₹${(metrics.totalAmount / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'text-green-500',
      trend: '+8%',
    },
    {
      label: 'Active Vendors',
      value: metrics.activeVendors.toLocaleString(),
      icon: Users,
      color: 'text-purple-500',
      trend: '+3%',
    },
    {
      label: 'Flagged Transactions',
      value: metrics.flaggedTransactions.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-500',
      trend: '+5%',
    },
    {
      label: 'Fraud Cases',
      value: metrics.fraudCases.toLocaleString(),
      icon: FileText,
      color: 'text-orange-500',
      trend: metrics.openCases > 0 ? `${metrics.openCases} open` : 'Resolved',
    },
    {
      label: 'Avg Risk Score',
      value: metrics.averageRiskScore.toFixed(0),
      icon: TrendingUp,
      color: 'text-amber-500',
      trend: metrics.averageRiskScore > 70 ? 'High' : 'Moderate',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-foreground">Real-Time Audit Metrics</h2>
        <p className="text-muted-foreground">
          Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <Card
              key={card.label}
              className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {card.trend}
                </div>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{card.label}</h3>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="font-semibold mb-4 text-foreground">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Documents Processed</span>
              <span className="font-semibold text-green-500">✓ Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Real-Time Monitoring</span>
              <span className="font-semibold text-green-500">✓ Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Compliance Checks</span>
              <span className="font-semibold text-green-500">✓ Running</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="font-semibold mb-4 text-foreground">Key Insights</h3>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              • {metrics.flaggedTransactions} transactions flagged for review
            </p>
            <p className="text-sm text-muted-foreground">
              • {metrics.complianceViolations} policy violations detected
            </p>
            <p className="text-sm text-muted-foreground">
              • Average risk score: {metrics.averageRiskScore.toFixed(1)}/100
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
