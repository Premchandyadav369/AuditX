"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { RefreshCw, AlertTriangle, Shield, MapPin } from "lucide-react"

interface DepartmentRisk {
  department: string
  riskScore: number
  transactionCount: number
  flaggedCount: number
  totalAmount: number
}

export default function RiskHeatmapPage() {
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState<DepartmentRisk[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const supabase = createBrowserClient()

  useEffect(() => {
    loadDepartmentRisks()
  }, [])

  const loadDepartmentRisks = async () => {
    setLoading(true)
    try {
      const { data: transactions } = await supabase.from("transactions").select("*")

      if (transactions) {
        const deptMap = new Map<string, DepartmentRisk>()

        transactions.forEach((t) => {
          const dept = t.department || "Unknown"
          if (!deptMap.has(dept)) {
            deptMap.set(dept, {
              department: dept,
              riskScore: 0,
              transactionCount: 0,
              flaggedCount: 0,
              totalAmount: 0,
            })
          }

          const deptData = deptMap.get(dept)!
          deptData.transactionCount++
          deptData.totalAmount += t.amount || 0
          if (t.fraud_score && t.fraud_score > 70) {
            deptData.flaggedCount++
          }
        })

        const risks = Array.from(deptMap.values()).map((d) => ({
          ...d,
          riskScore: d.transactionCount > 0 ? Math.round((d.flaggedCount / d.transactionCount) * 100) : 0,
        }))

        setDepartments(risks.sort((a, b) => b.riskScore - a.riskScore))
      }
    } catch (error) {
      console.error("Error loading department risks:", error)
    }
    setLoading(false)
  }

  const getRiskColor = (score: number) => {
    if (score >= 75) return "bg-red-500"
    if (score >= 50) return "bg-orange-500"
    if (score >= 25) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 75) return "Critical"
    if (score >= 50) return "High"
    if (score >= 25) return "Medium"
    return "Low"
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Risk Heatmap</h2>
          <p className="text-muted-foreground">Geographic and departmental risk visualization</p>
        </div>
        <div className="flex gap-3">
          <Select value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "map")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="map">Map View</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadDepartmentRisks} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Depts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {departments.filter((d) => d.riskScore >= 50).length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{departments.filter((d) => d.riskScore >= 75).length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Risk Depts</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {departments.filter((d) => d.riskScore < 25).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {departments.map((dept) => (
            <Card key={dept.department} className="glass-card hover-glow transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{dept.department}</CardTitle>
                    <CardDescription className="text-xs mt-1">{dept.transactionCount} transactions</CardDescription>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getRiskColor(dept.riskScore)} glow-blue`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold gradient-text">{dept.riskScore}%</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getRiskColor(dept.riskScore)} bg-opacity-20`}
                    >
                      {getRiskLevel(dept.riskScore)}
                    </span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getRiskColor(dept.riskScore)} glow-blue`}
                      style={{ width: `${dept.riskScore}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Flagged</p>
                      <p className="font-semibold">{dept.flaggedCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold">₹{(dept.totalAmount / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Geographic Risk Map</CardTitle>
            <CardDescription>Visual representation of risk distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[600px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Geographic Map View</p>
                <p className="text-sm text-muted-foreground">Interactive map visualization coming soon</p>
              </div>
              <Button onClick={() => setViewMode("grid")} variant="outline">
                View Grid Instead
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
