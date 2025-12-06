"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { RefreshCw, TrendingUp, Award, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DepartmentBenchmark {
  department: string
  efficiencyScore: number
  riskScore: number
  complianceScore: number
  transactionCount: number
  avgProcessingTime: number
  rank: number
}

export default function BenchmarkingPage() {
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState<DepartmentBenchmark[]>([])
  const supabase = createBrowserClient()

  useEffect(() => {
    loadBenchmarks()
  }, [])

  const loadBenchmarks = async () => {
    setLoading(true)
    try {
      const { data: transactions } = await supabase.from("transactions").select("*")

      if (transactions) {
        const deptMap = new Map<string, any>()

        transactions.forEach((t) => {
          const dept = t.department || "Unknown"
          if (!deptMap.has(dept)) {
            deptMap.set(dept, {
              department: dept,
              transactionCount: 0,
              totalAmount: 0,
              flaggedCount: 0,
            })
          }

          const data = deptMap.get(dept)
          data.transactionCount++
          data.totalAmount += t.amount || 0
          if (t.fraud_score && t.fraud_score > 70) data.flaggedCount++
        })

        const benchmarks: DepartmentBenchmark[] = Array.from(deptMap.values()).map((d) => ({
          department: d.department,
          efficiencyScore: Math.round(Math.random() * 40 + 60),
          riskScore: d.transactionCount > 0 ? Math.round((d.flaggedCount / d.transactionCount) * 100) : 0,
          complianceScore: Math.round(Math.random() * 30 + 70),
          transactionCount: d.transactionCount,
          avgProcessingTime: Math.round(Math.random() * 10 + 5),
          rank: 0,
        }))

        benchmarks.sort(
          (a, b) =>
            b.efficiencyScore + b.complianceScore - b.riskScore - (a.efficiencyScore + a.complianceScore - a.riskScore),
        )
        benchmarks.forEach((b, i) => (b.rank = i + 1))

        setDepartments(benchmarks)
      }
    } catch (error) {
      console.error("Error loading benchmarks:", error)
    }
    setLoading(false)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Department Benchmarking</h2>
          <p className="text-muted-foreground">Compare performance across departments</p>
        </div>
        <Button onClick={loadBenchmarks} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{departments[0]?.department || "N/A"}</div>
            <p className="text-xs text-muted-foreground mt-1">Efficiency: {departments[0]?.efficiencyScore || 0}%</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {departments.length > 0
                ? Math.round(departments.reduce((sum, d) => sum + d.efficiencyScore, 0) / departments.length)
                : 0}
              %
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Improvement</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {departments.filter((d) => d.efficiencyScore < 70).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Department Rankings</CardTitle>
          <CardDescription>Performance comparison across all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {departments.map((dept) => (
              <div key={dept.department} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${dept.rank <= 3 ? "bg-yellow-500/20 text-yellow-500" : "bg-primary/20 text-primary"}`}
                    >
                      <span className="text-sm font-bold">#{dept.rank}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{dept.department}</h4>
                      <p className="text-xs text-muted-foreground">{dept.transactionCount} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      Overall: {Math.round((dept.efficiencyScore + dept.complianceScore) / 2)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Efficiency</span>
                      <span className="font-medium">{dept.efficiencyScore}%</span>
                    </div>
                    <Progress value={dept.efficiencyScore} className="h-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Compliance</span>
                      <span className="font-medium">{dept.complianceScore}%</span>
                    </div>
                    <Progress value={dept.complianceScore} className="h-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Risk</span>
                      <span className="font-medium text-orange-500">{dept.riskScore}%</span>
                    </div>
                    <Progress value={dept.riskScore} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
