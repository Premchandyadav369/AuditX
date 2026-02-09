'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

export default function BudgetVariance() {
  const departments = [
    {
      name: 'Defence',
      budget: 2500,
      spent: 2100,
      variance: -16,
      status: 'under',
    },
    {
      name: 'Health',
      budget: 1800,
      spent: 1950,
      variance: 8,
      status: 'over',
    },
    {
      name: 'Education',
      budget: 1600,
      spent: 1580,
      variance: -1,
      status: 'on-track',
    },
    {
      name: 'Infrastructure',
      budget: 3200,
      spent: 3450,
      variance: 8,
      status: 'over',
    },
    {
      name: 'Agriculture',
      budget: 900,
      spent: 750,
      variance: -17,
      status: 'under',
    },
  ]

  const varianceData = [
    { month: 'Jan', budget: 500, spent: 480, variance: -4 },
    { month: 'Feb', budget: 520, spent: 550, variance: 6 },
    { month: 'Mar', budget: 540, spent: 520, variance: -4 },
    { month: 'Apr', budget: 560, spent: 600, variance: 7 },
    { month: 'May', budget: 580, spent: 560, variance: -3 },
    { month: 'Jun', budget: 600, spent: 620, variance: 3 },
  ]

  const getTrendIcon = (variance: number) => {
    return variance > 0 ? (
      <TrendingUp className="h-4 w-4 text-red-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-green-500" />
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Budget Variance Analysis</h1>
        <p className="text-muted-foreground">Department budget tracking & forecasting</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,000 Cr</div>
            <p className="text-xs text-muted-foreground">FY 2024-25</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹11,450 Cr</div>
            <p className="text-xs text-green-600">-4.6% underspent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overspend Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2</div>
            <p className="text-xs text-muted-foreground">Departments over budget</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={varianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
              <Bar dataKey="spent" fill="#ef4444" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={varianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="variance" stroke="#f59e0b" name="Variance %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Department Budget Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {departments.map((dept, i) => (
              <div key={i} className="space-y-2 border-b pb-3 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{dept.spent}Cr / ₹{dept.budget}Cr
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(dept.variance)}
                    <Badge
                      variant={
                        dept.status === 'over'
                          ? 'destructive'
                          : dept.status === 'under'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {Math.abs(dept.variance)}% {dept.status === 'over' ? 'Over' : 'Under'}
                    </Badge>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className={
                      dept.status === 'over'
                        ? 'h-full bg-red-500 rounded-full'
                        : 'h-full bg-green-500 rounded-full'
                    }
                    style={{
                      width: `${Math.min((dept.spent / dept.budget) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
