"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { KpiCard } from "@/components/kpi-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, AlertTriangle, IndianRupee, Shield, ChevronRight, Newspaper, TrendingUp } from "lucide-react"
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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Real-time fraud detection and compliance monitoring</p>
        </div>

        {/* Risk Score Banner */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-destructive/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{riskScore}</div>
                  <div className="text-xs text-muted-foreground">Risk</div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Current Risk Level: Medium-High</h2>
                <p className="text-muted-foreground">15 active fraud alerts require attention</p>
              </div>
            </div>
            <Button className="holographic-gradient glow-blue">
              View All Alerts
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            title="Total Transactions Analyzed"
            value="45,892"
            subtitle="This month"
            icon={Activity}
            trend={{ value: "12.5% from last month", positive: true }}
          />
          <KpiCard
            title="Fraud Flags"
            value="28"
            subtitle="Active alerts"
            icon={AlertTriangle}
            trend={{ value: "8 new today", positive: false }}
            className="border-destructive/30"
          />
          <KpiCard
            title="Estimated Savings"
            value="₹12.8Cr"
            subtitle="Fraud prevented"
            icon={IndianRupee}
            trend={{ value: "₹2.4Cr this month", positive: true }}
          />
          <KpiCard
            title="Compliance Score"
            value="94%"
            subtitle="Across all departments"
            icon={Shield}
            trend={{ value: "2% improvement", positive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Fraud Detection Trends */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">Fraud Detection Trends</h3>
              <p className="text-sm text-muted-foreground">Monthly detected vs prevented fraud cases</p>
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
                />
                <Line
                  type="monotone"
                  dataKey="prevented"
                  stroke="oklch(0.65 2.5 195)"
                  strokeWidth={2}
                  name="Prevented"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Department Risk Distribution */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">High-Risk Departments</h3>
              <p className="text-sm text-muted-foreground">Risk score by department</p>
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

        {/* Recent Alerts */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Recent Fraud Alerts</h3>
              <p className="text-sm text-muted-foreground">Latest suspicious activities detected by AI</p>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-all bg-background/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${alert.risk === "high" ? "bg-destructive" : "bg-chart-2"}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{alert.type}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          alert.risk === "high" ? "bg-destructive/10 text-destructive" : "bg-chart-2/10 text-chart-2"
                        }`}
                      >
                        {alert.risk.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.vendor} • {alert.amount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                  <Button size="sm" variant="outline">
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Real-Time News Intelligence Widget */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary" />
                Global Intelligence Feed
              </h3>
              <p className="text-sm text-muted-foreground">Latest fraud and compliance news worldwide</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/dashboard/news")}>
              View All News
            </Button>
          </div>

          <div className="space-y-3">
            {recentNews.map((news, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-all bg-background/50"
              >
                <TrendingUp className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1 leading-tight">{news.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{news.source}</span>
                    <span>•</span>
                    <span>{news.time}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full ${
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
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
