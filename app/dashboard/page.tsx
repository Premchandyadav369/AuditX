"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { KpiCard } from "@/components/kpi-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  AlertTriangle,
  IndianRupee,
  Shield,
  ChevronRight,
  Newspaper,
  TrendingUp,
  Brain,
  Search,
  Zap,
  FileText,
  Upload,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import Link from "next/link"
import { cn } from "@/lib/utils"

const fraudData = [
  { month: "Jan", detected: 12, prevented: 10 },
  { month: "Feb", detected: 18, prevented: 15 },
  { month: "Mar", detected: 25, prevented: 22 },
  { month: "Apr", detected: 15, prevented: 13 },
  { month: "May", detected: 32, prevented: 28 },
  { month: "Jun", detected: 28, prevented: 25 },
]

const departmentRisk = [
  { name: "Public Works", value: 85, color: "oklch(0.58 0.22 25)" },
  { name: "Healthcare", value: 72, color: "oklch(0.68 0.20 280)" },
  { name: "Education", value: 45, color: "oklch(0.58 0.18 252)" },
  { name: "Transport", value: 38, color: "oklch(0.65 0.25 195)" },
]

const recentAlerts = [
  {
    id: 1,
    type: "Duplicate Invoice",
    vendor: "ABC Construction Ltd",
    amount: "₹2,45,000",
    risk: "high",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "Price Anomaly",
    vendor: "Tech Solutions Inc",
    amount: "₹8,92,000",
    risk: "medium",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "Missing PO",
    vendor: "Office Supplies Co",
    amount: "₹45,000",
    risk: "high",
    time: "1 day ago",
  },
]

const recentNews = [
  {
    title: "Major Procurement Fraud Uncovered in Public Works",
    source: "Economic Times",
    time: "2 hours ago",
    category: "fraud",
  },
  {
    title: "CAG Report Highlights ₹450Cr Irregularities",
    source: "The Hindu",
    time: "5 hours ago",
    category: "investigation",
  },
  {
    title: "New Compliance Rules for Government Vendors",
    source: "Business Standard",
    time: "1 day ago",
    category: "policy",
  },
]

const riskScore = 67

const quickActions = [
  { title: "Ask AI Copilot", icon: Brain, href: "/dashboard/ai-copilot", color: "text-blue-500" },
  { title: "Smart Search", icon: Search, href: "/dashboard/smart-search", color: "text-purple-500" },
  { title: "Predict Risk", icon: TrendingUp, href: "/dashboard/predictive", color: "text-orange-500" },
  { title: "Upload Audit", icon: Upload, href: "/dashboard/upload", color: "text-green-500" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Command Center</h1>
            <p className="text-muted-foreground">Unified audit intelligence and fraud monitoring</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/settings">
                <Shield className="w-4 h-4 mr-2" />
                Security Status
              </Link>
            </Button>
            <Button className="holographic-gradient glow-blue" asChild>
              <Link href="/dashboard/ai-copilot">
                <Brain className="w-4 h-4 mr-2" />
                Launch Copilot
              </Link>
            </Button>
          </div>
        </div>

        {/* Top Section: Risk Score & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-destructive/10 via-background to-background border-destructive/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <AlertTriangle className="w-32 h-32" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-destructive/30 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">{riskScore}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Risk Index</div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Risk Level: Elevated</h2>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    System has detected 15 active alerts and 3 high-probability fraud patterns in the last 24 hours.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" asChild>
                      <Link href="/dashboard/alerts">Review Alerts</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/fraud-patterns">Analyze Patterns</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-accent hover:border-primary/30 transition-all group text-center"
                >
                  <action.icon className={cn("w-6 h-6 mb-2 group-hover:scale-110 transition-transform", action.color)} />
                  <span className="text-xs font-medium text-foreground">{action.title}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            title="Transactions Analyzed"
            value="45,892"
            subtitle="Real-time monitoring"
            icon={Activity}
            trend={{ value: "12.5% vs last month", positive: true }}
          />
          <KpiCard
            title="Potential Fraud"
            value="₹4.2Cr"
            subtitle="Risk exposure"
            icon={AlertTriangle}
            trend={{ value: "5 new critical", positive: false }}
            className="border-destructive/30"
          />
          <KpiCard
            title="Savings Realized"
            value="₹12.8Cr"
            subtitle="Prevention ROI"
            icon={IndianRupee}
            trend={{ value: "₹2.4Cr this month", positive: true }}
          />
          <KpiCard
            title="Compliance"
            value="94.2%"
            subtitle="Overall score"
            icon={Shield}
            trend={{ value: "2.1% improvement", positive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Fraud Detection Trends */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Intelligence Trends</h3>
                <p className="text-sm text-muted-foreground">Fraud detection vs. prevention performance</p>
              </div>
              <Button variant="ghost" size="icon">
                <FileText className="w-4 h-4" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={fraudData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.04 252)" />
                <XAxis dataKey="month" stroke="oklch(0.65 0.02 252)" style={{ fontSize: "12px" }} />
                <YAxis stroke="oklch(0.65 0.02 252)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.18 0.03 252)",
                    border: "1px solid oklch(0.28 0.04 252)",
                    borderRadius: "8px",
                    color: "oklch(0.98 0.005 252)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="detected"
                  stroke="oklch(0.58 0.18 252)"
                  strokeWidth={2}
                  name="Detected"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="prevented"
                  stroke="oklch(0.65 2.5 195)"
                  strokeWidth={2}
                  name="Prevented"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Department Risk Distribution */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Predictive Risk Exposure</h3>
                <p className="text-sm text-muted-foreground">Projected risk scores by department</p>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30">AI PROJECTED</Badge>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={departmentRisk} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.04 252)" />
                <XAxis type="number" stroke="oklch(0.65 0.02 252)" style={{ fontSize: "12px" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="oklch(0.65 0.02 252)"
                  style={{ fontSize: "12px" }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.18 0.03 252)",
                    border: "1px solid oklch(0.28 0.04 252)",
                    borderRadius: "8px",
                    color: "oklch(0.98 0.005 252)",
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {departmentRisk.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Critical Anomalies</h3>
                <p className="text-sm text-muted-foreground">Live feed of high-risk transactions</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/alerts">View All</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-all bg-background/50 group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${alert.risk === "high" ? "bg-destructive animate-pulse" : "bg-chart-2"}`}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{alert.type}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider ${
                            alert.risk === "high" ? "bg-destructive/10 text-destructive" : "bg-chart-2/10 text-chart-2"
                          }`}
                        >
                          {alert.risk.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.vendor} • <span className="text-foreground font-medium">{alert.amount}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Global News Feed */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-primary" />
                  Global Intelligence
                </h3>
                <p className="text-sm text-muted-foreground">Fraud & compliance feed</p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/news">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {recentNews.map((news, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="flex items-start gap-3 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
                      {news.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pl-7">
                    <span>{news.source} • {news.time}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter ${
                        news.category === "fraud"
                          ? "bg-destructive/10 text-destructive"
                          : news.category === "investigation"
                            ? "bg-chart-2/10 text-chart-2"
                            : "bg-primary/10 text-primary"
                      }`}
                    >
                      {news.category}
                    </span>
                  </div>
                  {index < recentNews.length - 1 && <div className="mt-4 border-b border-border/30" />}
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2 text-xs h-8" asChild>
                <Link href="/dashboard/news">View Global Feed</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", className)}>
      {children}
    </span>
  )
}
