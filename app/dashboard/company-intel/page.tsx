"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Building2,
  AlertTriangle,
  XCircle,
  Shield,
  TrendingUp,
  FileText,
  Scale,
  Users,
  CheckCircle2,
  AlertCircle,
  Info,
  DollarSign,
  Award,
  Newspaper,
  Briefcase,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function CompanyIntelligencePage() {
  const [companyName, setCompanyName] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchType, setSearchType] = useState<"general" | "compliance" | "misconduct">("general")

  const handleSearch = async () => {
    if (!companyName.trim()) return

    setLoading(true)
    setData(null)
    setError(null)

    try {
      const response = await fetch("/api/company-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, searchType }),
      })

      const result = await response.json()
      if (result.error) {
        setError(result.error)
      } else {
        setData(result)
      }
    } catch (err: any) {
      console.error("Search failed:", err)
      setError("Failed to connect to the intelligence service. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 75) return "text-red-500"
    if (score >= 50) return "text-orange-500"
    if (score >= 25) return "text-yellow-500"
    return "text-green-500"
  }

  const getRiskBadge = (score: number) => {
    if (score >= 75)
      return (
        <Badge variant="destructive" className="text-sm">
          Critical Risk
        </Badge>
      )
    if (score >= 50) return <Badge className="bg-orange-500 hover:bg-orange-600 text-sm">High Risk</Badge>
    if (score >= 25) return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-sm">Medium Risk</Badge>
    return <Badge className="bg-green-500 hover:bg-green-600 text-sm">Low Risk</Badge>
  }

  const renderDataSection = (
    title: string,
    icon: any,
    data: any,
    variant: "default" | "warning" | "danger" = "default",
  ) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return null

    const Icon = icon
    const borderClass = variant === "danger" ? "border-red-500/50" : variant === "warning" ? "border-orange-500/50" : ""

    return (
      <Card className={`glass-card ${borderClass}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {typeof data === "string" ? (
            <p className="text-sm leading-relaxed">{data}</p>
          ) : Array.isArray(data) ? (
            data.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1">
                {typeof item === "string" ? (
                  <p className="text-sm">{item}</p>
                ) : (
                  Object.entries(item).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="text-xs font-medium text-muted-foreground capitalize min-w-24">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="text-sm flex-1">{String(value)}</span>
                    </div>
                  ))
                )}
              </div>
            ))
          ) : (
            <div className="space-y-2">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex gap-3 items-start">
                  <span className="text-sm font-medium text-muted-foreground capitalize min-w-32">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="text-sm flex-1 font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <Search className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Company Intelligence System
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered real-time intelligence gathering and risk assessment
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <Card className="glass-card border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Intelligence Search
          </CardTitle>
          <CardDescription>
            Enter company name to conduct comprehensive background check and risk analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general" className="gap-2">
                <Info className="w-4 h-4" />
                General Intel
              </TabsTrigger>
              <TabsTrigger value="compliance" className="gap-2">
                <Shield className="w-4 h-4" />
                Compliance
              </TabsTrigger>
              <TabsTrigger value="misconduct" className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                Misconduct
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-3">
            <Input
              placeholder="Enter company name (e.g., TechCorp Solutions Pvt Ltd)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 h-11"
            />
            <Button onClick={handleSearch} disabled={loading || !companyName.trim()} className="gap-2 h-11 px-6">
              <Search className="w-4 h-4" />
              {loading ? "Analyzing..." : "Search"}
            </Button>
          </div>

          {searchType === "general" && (
            <p className="text-xs text-muted-foreground">
              Retrieves company overview, financial health, reputation, and risk indicators
            </p>
          )}
          {searchType === "compliance" && (
            <p className="text-xs text-muted-foreground">
              Checks regulatory compliance, blacklists, legal cases, and certifications
            </p>
          )}
          {searchType === "misconduct" && (
            <p className="text-xs text-muted-foreground">
              Searches for fraud cases, corruption, financial irregularities, and investigations
            </p>
          )}
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="glass-card border-red-500/30 bg-red-500/5">
          <CardContent className="py-6">
            <div className="flex items-center gap-3 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSearch}
              className="mt-4 border-red-500/30 hover:bg-red-500/10 text-red-500"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="glass-card border-blue-500/30">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-blue-500"></div>
                <Search className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-medium">Conducting Intelligence Search</p>
                <p className="text-sm text-muted-foreground">Analyzing data from multiple sources...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-6">
          {/* Company Header Card */}
          <Card className="glass-card border-2">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                    <Building2 className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{data.companyName || companyName}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Intelligence Report Generated</p>
                  </div>
                </div>
                {data.overall_risk_score !== undefined && getRiskBadge(data.overall_risk_score)}
              </div>
            </CardContent>
          </Card>

          {/* Risk Score Dashboard */}
          {data.overall_risk_score !== undefined && (
            <Card className="glass-card border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Risk Assessment Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-end gap-3">
                      <div className={`text-7xl font-bold ${getRiskColor(data.overall_risk_score)}`}>
                        {data.overall_risk_score}
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground">Risk Score</p>
                        <p className="text-xs text-muted-foreground">Out of 100</p>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          data.overall_risk_score >= 75
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : data.overall_risk_score >= 50
                              ? "bg-gradient-to-r from-orange-500 to-orange-600"
                              : data.overall_risk_score >= 25
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                                : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        style={{ width: `${data.overall_risk_score}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm mb-3">Risk Indicators</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="text-sm flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Compliance Risk
                        </span>
                        <Badge variant="outline">{data.overall_risk_score >= 60 ? "High" : "Low"}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="text-sm flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Financial Risk
                        </span>
                        <Badge variant="outline">{data.overall_risk_score >= 50 ? "Medium" : "Low"}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Reputation Risk
                        </span>
                        <Badge variant="outline">{data.overall_risk_score >= 40 ? "Medium" : "Low"}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabbed Intelligence Report */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {data.overview && renderDataSection("Company Overview", Building2, data.overview)}
              {data.gst_pan_status && renderDataSection("Tax Verification", Shield, data.gst_pan_status)}
              {data.financial_health && renderDataSection("Financial Health", TrendingUp, data.financial_health)}
              {data.reputation && renderDataSection("Reputation Analysis", Award, data.reputation)}
              {data.contracts && renderDataSection("Government Contracts", Briefcase, data.contracts)}
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-4">
              {data.compliance_status && renderDataSection("Compliance Status", Shield, data.compliance_status)}
              {data.certifications && renderDataSection("Certifications & Licenses", Award, data.certifications)}
              {data.audit_findings && renderDataSection("Audit Findings", FileText, data.audit_findings, "warning")}
              {data.blacklists && renderDataSection("Blacklists & Sanctions", XCircle, data.blacklists, "danger")}
              {data.legal_cases && renderDataSection("Legal Cases", Scale, data.legal_cases, "warning")}
            </TabsContent>

            {/* Risks Tab */}
            <TabsContent value="risks" className="space-y-4">
              {data.fraud_cases && renderDataSection("Fraud Cases", AlertTriangle, data.fraud_cases, "danger")}
              {data.corruption && renderDataSection("Corruption Allegations", XCircle, data.corruption, "danger")}
              {data.financial_issues &&
                renderDataSection("Financial Irregularities", DollarSign, data.financial_issues, "warning")}
              {data.complaints && renderDataSection("Vendor Complaints", Users, data.complaints, "warning")}
              {data.investigations && renderDataSection("Active Investigations", Search, data.investigations, "danger")}
              {data.court_cases && renderDataSection("Court Cases", Scale, data.court_cases, "warning")}
              {data.risk_indicators &&
                renderDataSection("Risk Indicators", AlertCircle, data.risk_indicators, "warning")}
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-4">
              {data.news && renderDataSection("Recent News", Newspaper, data.news)}
              {data.news_items && renderDataSection("News Coverage", Newspaper, data.news_items)}
              {data.recommendation && (
                <Card className="glass-card border-2 border-blue-500/30 bg-blue-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-400">
                      <CheckCircle2 className="w-5 h-5" />
                      AI Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{data.recommendation}</p>
                  </CardContent>
                </Card>
              )}
              {data.summary && (
                <Card className="glass-card border-2 border-purple-500/30 bg-purple-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-400">
                      <FileText className="w-5 h-5" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{data.summary}</p>
                  </CardContent>
                </Card>
              )}
              {(data.severity || data.risk_level) && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Threat Level Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        {(data.severity || data.risk_level || "").toUpperCase()}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Based on intelligence gathered from multiple sources
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Raw Response Fallback */}
          {data.parsed === false && (
            <Card className="glass-card border-orange-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Raw Intelligence Report
                </CardTitle>
                <CardDescription>Unstructured data from intelligence sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono">{data.raw_response}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
