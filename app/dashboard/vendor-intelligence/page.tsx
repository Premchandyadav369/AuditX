'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function VendorIntelligence() {
  const [vendors, setVendors] = useState<any[]>([])
  const [stats, setStats] = useState({
    highRisk: 0,
    blacklisted: 0,
    verified: 0,
    total: 0,
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchVendors = async () => {
      const { data } = await supabase
        .from('vendors')
        .select('*')
        .order('risk_score', { ascending: false })

      if (data) {
        setVendors(data)
        setStats({
          highRisk: data.filter((v: any) => v.risk_score >= 70).length,
          blacklisted: data.filter((v: any) => v.is_blacklisted).length,
          verified: data.filter((v: any) => v.tax_id).length,
          total: data.length,
        })
      }
    }

    fetchVendors()
  }, [supabase])

  const riskLevel = (score: number) => {
    if (score >= 80) return { label: 'Critical', color: 'bg-red-500', text: 'text-red-600' }
    if (score >= 60) return { label: 'High', color: 'bg-orange-500', text: 'text-orange-600' }
    if (score >= 40) return { label: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-600' }
    return { label: 'Low', color: 'bg-green-500', text: 'text-green-600' }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Vendor Intelligence</h1>
        <p className="text-muted-foreground">Risk profiling & network analysis</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Active partnerships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.highRisk}</div>
            <p className="text-xs text-muted-foreground">Require monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blacklisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.blacklisted}</div>
            <p className="text-xs text-muted-foreground">Blocked from transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">Tax ID confirmed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              High-Risk Vendors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vendors
              .filter((v) => v.risk_score >= 70)
              .slice(0, 5)
              .map((vendor, i) => {
                const risk = riskLevel(vendor.risk_score)
                return (
                  <div key={i} className="space-y-2 border-b pb-3 last:border-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{vendor.name}</p>
                      <Badge className={risk.color}>{risk.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3" />
                      <span>Risk Score: {vendor.risk_score}</span>
                    </div>
                    <Progress value={vendor.risk_score} className="h-1.5" />
                  </div>
                )
              })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vendor Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { metric: 'Total Transactions', value: '1,245', trend: '+5%' },
              { metric: 'Avg Transaction Value', value: '₹2.3L', trend: '-2%' },
              { metric: 'Payment Terms Violation', value: '12%', trend: '+1%' },
              { metric: 'Delivery On-Time Rate', value: '94%', trend: '+3%' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{item.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.value}</span>
                  <span className="text-xs text-green-600">{item.trend}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {vendors.slice(0, 8).map((vendor, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium text-sm">{vendor.name}</p>
                  <p className="text-xs text-muted-foreground">{vendor.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  {vendor.is_blacklisted && <Badge variant="destructive">Blacklisted</Badge>}
                  <Badge variant="outline">Score: {vendor.risk_score}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
