"use client"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Sparkles,
  Loader2,
} from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface Report {
  id: string
  report_name: string
  report_type: string
  status: "pending" | "processing" | "completed" | "failed"
  created_at: string
  completed_at?: string
  file_url?: string
}

const REPORT_TEMPLATES = [
  {
    id: "fraud-summary",
    name: "Fraud Detection Summary",
    description: "Comprehensive overview of all detected fraud cases",
    icon: AlertTriangle,
    color: "text-red-400",
    fields: ["date_range", "severity", "status", "department"],
  },
  {
    id: "compliance-audit",
    name: "Compliance Audit Report",
    description: "Policy violations and compliance metrics",
    icon: CheckCircle2,
    color: "text-green-400",
    fields: ["date_range", "policy_type", "department"],
  },
  {
    id: "vendor-risk",
    name: "Vendor Risk Analysis",
    description: "Risk scores and transaction patterns by vendor",
    icon: Users,
    color: "text-blue-400",
    fields: ["date_range", "risk_threshold", "vendor_category"],
  },
  {
    id: "transaction-analysis",
    name: "Transaction Analysis",
    description: "Detailed transaction patterns and anomalies",
    icon: DollarSign,
    color: "text-yellow-400",
    fields: ["date_range", "amount_range", "department", "transaction_type"],
  },
  {
    id: "department-spending",
    name: "Department Spending Report",
    description: "Spending analysis by department",
    icon: Building2,
    color: "text-purple-400",
    fields: ["date_range", "department", "category"],
  },
  {
    id: "executive-dashboard",
    name: "Executive Dashboard",
    description: "High-level KPIs and trends for leadership",
    icon: TrendingUp,
    color: "text-orange-400",
    fields: ["date_range"],
  },
]

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState("last-30-days")
  const [department, setDepartment] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<Report[]>([])
  const [generatedReport, setGeneratedReport] = useState<string | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (data) setReports(data)
    }
  }

  const generateAIReport = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    setGeneratedReport(null)

    try {
      const template = REPORT_TEMPLATES.find((t) => t.id === selectedTemplate)

      const response = await fetch("/api/ai/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: template?.name,
          dateRange: {
            start: getDateRangeStart(dateRange),
            end: new Date().toISOString().split("T")[0],
          },
          department: department === "all" ? null : department,
          filters: {},
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedReport(data.report)

        // Save report to database
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          await supabase.from("reports").insert({
            user_id: user.id,
            report_name: template?.name || "Custom Report",
            report_type: selectedTemplate,
            status: "completed",
            completed_at: new Date().toISOString(),
            parameters: { dateRange, department },
            content: data.report,
          })

          loadReports()
        }
      }
    } catch (error) {
      console.error("Report generation error:", error)
      alert("Failed to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getDateRangeStart = (range: string) => {
    const today = new Date()
    switch (range) {
      case "last-7-days":
        return new Date(today.setDate(today.getDate() - 7)).toISOString().split("T")[0]
      case "last-30-days":
        return new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0]
      case "last-90-days":
        return new Date(today.setDate(today.getDate() - 90)).toISOString().split("T")[0]
      case "last-quarter":
        return new Date(today.setMonth(today.getMonth() - 3)).toISOString().split("T")[0]
      case "last-year":
        return new Date(today.setFullYear(today.getFullYear() - 1)).toISOString().split("T")[0]
      default:
        return new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0]
    }
  }

  const downloadMarkdown = () => {
    if (!generatedReport) return

    const blob = new Blob([generatedReport], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-report-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">AI-Powered Reports</h1>
            <p className="text-muted-foreground">Generate comprehensive audit reports with Google Gemini AI</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Report Templates</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {REPORT_TEMPLATES.map((template) => {
                    const Icon = template.icon
                    return (
                      <Card
                        key={template.id}
                        className={`p-6 cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? "bg-primary/10 border-primary glow-blue"
                            : "bg-card/50 border-border/50 hover:bg-accent"
                        } backdrop-blur-sm`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <Icon className={`w-8 h-8 ${template.color} mb-4`} />
                        <h3 className="font-semibold text-foreground mb-2">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {generatedReport && (
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold text-foreground">Generated Report</h2>
                    </div>
                    <Button onClick={downloadMarkdown} size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <Textarea
                      value={generatedReport}
                      readOnly
                      className="min-h-[600px] font-mono text-sm bg-background/50 border-border"
                    />
                  </div>
                </Card>
              )}

              {!generatedReport && reports.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Recent Reports</h2>
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <Card key={report.id} className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{report.report_name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {new Date(report.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {report.status === "completed" && (
                              <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                            {report.status === "processing" && (
                              <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                                <Clock className="w-3 h-3 mr-1" />
                                Processing
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-6">Configuration</h2>

                {selectedTemplate ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground mb-2 block">Date Range</Label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                          <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                          <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                          <SelectItem value="last-quarter">Last Quarter</SelectItem>
                          <SelectItem value="last-year">Last Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 block">Department</Label>
                      <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="Ministry of Finance">Ministry of Finance</SelectItem>
                          <SelectItem value="Ministry of Home Affairs">Ministry of Home Affairs</SelectItem>
                          <SelectItem value="Ministry of Defence">Ministry of Defence</SelectItem>
                          <SelectItem value="Ministry of Health & Family Welfare">
                            Ministry of Health & Family Welfare
                          </SelectItem>
                          <SelectItem value="Ministry of Education">Ministry of Education</SelectItem>
                          <SelectItem value="Ministry of Rural Development">Ministry of Rural Development</SelectItem>
                          <SelectItem value="Ministry of Road Transport & Highways">
                            Ministry of Road Transport & Highways
                          </SelectItem>
                          <SelectItem value="Ministry of Railways">Ministry of Railways</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={generateAIReport}
                      disabled={isGenerating}
                      className="w-full holographic-gradient glow-blue"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate AI Report
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a report template to begin</p>
                  </div>
                )}
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">AI Features</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive data analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <span>Fraud pattern detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <span>Actionable recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <span>Executive summaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <span>Compliance analysis</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
