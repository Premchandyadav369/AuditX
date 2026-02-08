"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Users, Building2, Download } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const FRAUD_TREND_DATA = [
  { month: "Jan", cases: 8, amount: 125000 },
  { month: "Feb", cases: 12, amount: 185000 },
  { month: "Mar", cases: 15, amount: 245000 },
  { month: "Apr", cases: 10, amount: 156000 },
  { month: "May", cases: 18, amount: 312000 },
  { month: "Jun", cases: 14, amount: 198000 },
  { month: "Jul", cases: 16, amount: 267000 },
  { month: "Aug", cases: 20, amount: 389000 },
  { month: "Sep", cases: 17, amount: 298000 },
  { month: "Oct", cases: 22, amount: 456000 },
  { month: "Nov", cases: 19, amount: 367000 },
  { month: "Dec", cases: 24, amount: 512000 },
]

const DEPARTMENT_SPENDING = [
  { name: "Facilities", value: 4200000, percentage: 32 },
  { name: "IT", value: 2800000, percentage: 21 },
  { name: "Executive", value: 2500000, percentage: 19 },
  { name: "Administration", value: 1900000, percentage: 14 },
  { name: "HR", value: 1100000, percentage: 8 },
  { name: "Other", value: 800000, percentage: 6 },
]

const RISK_DISTRIBUTION = [
  { range: "0-20", count: 156 },
  { range: "21-40", count: 89 },
  { range: "41-60", count: 45 },
  { range: "61-80", count: 28 },
  { range: "81-100", count: 12 },
]

const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#6366F1"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("last-12-months")

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0A1A2F] via-[#112240] to-[#0A1A2F]">
      <DashboardNav />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Advanced Analytics</h1>
              <p className="text-gray-400">Deep insights into fraud patterns and spending trends</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                  <SelectItem value="year-to-date">Year to Date</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-6">
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Total Fraud Detected</p>
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">₹31 Cr</p>
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+23% vs last period</span>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Active Cases</p>
                <Users className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">47</p>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>-12% vs last period</span>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Avg Risk Score</p>
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">42/100</p>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>-8% improvement</span>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Recovery Rate</p>
                <Building2 className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">67%</p>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+15% vs last period</span>
              </div>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Fraud Trend Over Time */}
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6">Fraud Detection Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={FRAUD_TREND_DATA}>
                  <defs>
                    <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Area type="monotone" dataKey="cases" stroke="#3B82F6" fill="url(#fraudGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Department Spending */}
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6">Department Spending Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={DEPARTMENT_SPENDING}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {DEPARTMENT_SPENDING.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Risk Score Distribution */}
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6">Risk Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={RISK_DISTRIBUTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis
                    dataKey="range"
                    stroke="#9CA3AF"
                    label={{ value: "Risk Score Range", position: "insideBottom", offset: -5, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    label={{ value: "Transaction Count", angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Fraud Amount Trend */}
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6">Fraud Amount by Month</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={FRAUD_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `₹${value / 1000}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#EC4899"
                    strokeWidth={3}
                    dot={{ fill: "#EC4899", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Insights */}
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-gray-400 mb-1">Highest Risk Department</p>
                <p className="text-xl font-bold text-white">Executive</p>
                <p className="text-xs text-red-400 mt-1">45% spike in consulting spend</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-gray-400 mb-1">Most Common Fraud Type</p>
                <p className="text-xl font-bold text-white">Overbilling</p>
                <p className="text-xs text-yellow-400 mt-1">42% of all detected cases</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-gray-400 mb-1">Best Performing Control</p>
                <p className="text-xl font-bold text-white">Duplicate Detection</p>
                <p className="text-xs text-green-400 mt-1">₹1.2 Cr prevented this quarter</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
