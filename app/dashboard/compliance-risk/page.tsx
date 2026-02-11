"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, AlertTriangle, TrendingUp, Building2, FileText } from "lucide-react"

interface ComplianceAnalysis {
  vendorRisk?: {
    vendorName: string
    riskScore: number
    compliance: number
    history: string
    recommendations: string[]
  }
  policyCompliance?: {
    department: string
    compliance: number
    violations: string[]
    requiredImprovements: string[]
  }
  regulatoryStatus?: {
    regulations: string[]
    status: string
    timeline: string
    nextSteps: string[]
  }
  riskHeatmap?: {
    regions: Array<{ name: string; riskLevel: string; score: number }>
    topRisks: string[]
    mitigation: string[]
  }
}

export default function ComplianceRiskPage() {
  const [activeTab, setActiveTab] = useState("vendor")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<ComplianceAnalysis | null>(null)
  const [error, setError] = useState("")

  const analyze = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a vendor name or search term")
      return
    }

    setLoading(true)
    setError("")
    setAnalysis(null)

    try {
      const response = await fetch("/api/compliance/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          analysisType: activeTab,
        }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result = await response.json()
      setAnalysis(result.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze")
      console.log("[v0] Compliance analysis error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Compliance & Risk Intelligence</h1>
          <p className="text-foreground/60">
            Unified analysis of vendor compliance, policy adherence, regulatory status, and risk distribution
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6 border border-border/50 bg-card/50">
          <div className="flex gap-2">
            <Input
              placeholder="Enter vendor name, department, or search term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && analyze()}
              className="flex-1 bg-background/50 border-border/30"
            />
            <Button onClick={analyze} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </Card>

        {error && (
          <Card className="p-4 mb-6 bg-red-500/10 border-red-500/30">
            <p className="text-red-500">{error}</p>
          </Card>
        )}

        {/* Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-card/50 border border-border/30">
            <TabsTrigger value="vendor" className="gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Vendors</span>
            </TabsTrigger>
            <TabsTrigger value="policy" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Policy</span>
            </TabsTrigger>
            <TabsTrigger value="regulatory" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Regulatory</span>
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Heatmap</span>
            </TabsTrigger>
          </TabsList>

          {/* Vendor Intelligence Tab */}
          <TabsContent value="vendor">
            {analysis?.vendorRisk ? (
              <div className="grid gap-6">
                <Card className="p-6 bg-card/50 border-border/30">
                  <h3 className="text-lg font-semibold mb-4">{analysis.vendorRisk.vendorName}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-background/50 rounded-lg border border-border/30">
                      <p className="text-sm text-foreground/60">Risk Score</p>
                      <p className="text-2xl font-bold text-foreground">
                        {analysis.vendorRisk.riskScore}
                        <span className="text-sm">/100</span>
                      </p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg border border-border/30">
                      <p className="text-sm text-foreground/60">Compliance Rate</p>
                      <p className="text-2xl font-bold text-foreground">
                        {analysis.vendorRisk.compliance}
                        <span className="text-sm">%</span>
                      </p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-2">History & Background</p>
                    <p className="text-foreground/80 whitespace-pre-wrap">{analysis.vendorRisk.history}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2">Recommendations</p>
                    <ul className="space-y-2">
                      {analysis.vendorRisk.recommendations?.map((rec, i) => (
                        <li key={i} className="text-sm text-foreground/80 flex gap-2">
                          <span className="text-primary">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 bg-card/50 border-border/30 text-center">
                <p className="text-foreground/60">Enter a vendor name to analyze vendor compliance and risk</p>
              </Card>
            )}
          </TabsContent>

          {/* Policy Compliance Tab */}
          <TabsContent value="policy">
            {analysis?.policyCompliance ? (
              <Card className="p-6 bg-card/50 border-border/30">
                <h3 className="text-lg font-semibold mb-4">{analysis.policyCompliance.department} - Policy Compliance</h3>
                <div className="mb-6 p-4 bg-background/50 rounded-lg border border-border/30">
                  <p className="text-sm text-foreground/60">Compliance Score</p>
                  <p className="text-3xl font-bold text-foreground">{analysis.policyCompliance.compliance}%</p>
                </div>

                {analysis.policyCompliance.violations.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-2 text-red-500">Policy Violations</p>
                    <ul className="space-y-2">
                      {analysis.policyCompliance.violations.map((v, i) => (
                        <li key={i} className="text-sm text-foreground/80 flex gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold mb-2">Required Improvements</p>
                  <ul className="space-y-2">
                    {analysis.policyCompliance.requiredImprovements?.map((imp, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex gap-2">
                        <span className="text-primary">→</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ) : (
              <Card className="p-12 bg-card/50 border-border/30 text-center">
                <p className="text-foreground/60">Enter a department name to analyze policy compliance</p>
              </Card>
            )}
          </TabsContent>

          {/* Regulatory Status Tab */}
          <TabsContent value="regulatory">
            {analysis?.regulatoryStatus ? (
              <Card className="p-6 bg-card/50 border-border/30">
                <h3 className="text-lg font-semibold mb-4">Regulatory Compliance Status</h3>
                <div className="mb-6 p-4 bg-background/50 rounded-lg border border-border/30">
                  <p className="text-sm font-semibold mb-2">Current Status</p>
                  <p className="text-foreground text-lg font-semibold">{analysis.regulatoryStatus.status}</p>
                  <p className="text-sm text-foreground/60 mt-2">{analysis.regulatoryStatus.timeline}</p>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-semibold mb-2">Applicable Regulations</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.regulatoryStatus.regulations?.map((reg, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Next Steps</p>
                  <ol className="space-y-2">
                    {analysis.regulatoryStatus.nextSteps?.map((step, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex gap-2">
                        <span className="font-semibold text-primary">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </Card>
            ) : (
              <Card className="p-12 bg-card/50 border-border/30 text-center">
                <p className="text-foreground/60">Search for regulatory information to view compliance status</p>
              </Card>
            )}
          </TabsContent>

          {/* Risk Heatmap Tab */}
          <TabsContent value="heatmap">
            {analysis?.riskHeatmap ? (
              <div className="grid gap-6">
                <Card className="p-6 bg-card/50 border-border/30">
                  <h3 className="text-lg font-semibold mb-4">Geographic Risk Heatmap</h3>
                  <div className="space-y-3 mb-6">
                    {analysis.riskHeatmap.regions?.map((region, i) => (
                      <div key={i} className="p-3 bg-background/50 rounded-lg border border-border/30">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-foreground">{region.name}</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              region.riskLevel === "Critical"
                                ? "bg-red-500/20 text-red-500"
                                : region.riskLevel === "High"
                                  ? "bg-orange-500/20 text-orange-500"
                                  : region.riskLevel === "Medium"
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "bg-green-500/20 text-green-500"
                            }`}
                          >
                            {region.riskLevel}
                          </span>
                        </div>
                        <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              region.score > 75
                                ? "bg-red-500"
                                : region.score > 50
                                  ? "bg-orange-500"
                                  : region.score > 25
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                            }`}
                            style={{ width: `${region.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 border-border/30">
                  <h3 className="text-lg font-semibold mb-4">Top Risk Factors</h3>
                  <ul className="space-y-2 mb-6">
                    {analysis.riskHeatmap.topRisks?.map((risk, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        {risk}
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-semibold mb-4">Mitigation Strategies</h3>
                  <ul className="space-y-2">
                    {analysis.riskHeatmap.mitigation?.map((mit, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex gap-2">
                        <span className="text-primary">✓</span>
                        {mit}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ) : (
              <Card className="p-12 bg-card/50 border-border/30 text-center">
                <p className="text-foreground/60">Generate risk analysis to view geographic risk distribution</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
