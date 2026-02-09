'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, TrendingUp, Shield, Activity } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function AnomalyDetection() {
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [stats, setStats] = useState({
    detected: 0,
    confirmed: 0,
    critical: 0,
    accuracy: 0,
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAnomalies = async () => {
      const { data, error } = await supabase
        .from('anomalies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (data) {
        setAnomalies(data)
        setStats({
          detected: data.length,
          confirmed: data.filter((a: any) => a.is_confirmed).length,
          critical: data.filter((a: any) => a.severity === 'critical').length,
          accuracy: Math.round((data.filter((a: any) => a.is_confirmed).length / data.length) * 100) || 0,
        })
      }
    }

    fetchAnomalies()
  }, [supabase])

  const anomalyData = anomalies
    .filter((_, i) => i < 7)
    .reverse()
    .map((a, i) => ({
      day: `Day ${i + 1}`,
      score: a.statistical_score || Math.random() * 100,
      confirmed: a.is_confirmed ? 1 : 0,
    }))

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Anomaly Detection Engine</h1>
        <p className="text-muted-foreground">ML-powered fraud pattern recognition</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Anomalies Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.detected}</div>
            <p className="text-xs text-green-600">+12% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmed Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-orange-600">{stats.accuracy}% accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-xs">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Detection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-green-600">Above baseline</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Anomaly Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={anomalyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#ef4444" name="Anomaly Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detection by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Unusual Amount', count: 24, pct: 45 },
                { type: 'Duplicate Payment', count: 15, pct: 28 },
                { type: 'Timing Anomaly', count: 10, pct: 19 },
                { type: 'Vendor Mismatch', count: 4, pct: 8 },
              ].map((item) => (
                <div key={item.type}>
                  <div className="flex justify-between text-sm">
                    <span>{item.type}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                  <div className="mt-1 h-2 bg-muted rounded-full">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Recent Anomalies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {anomalies.slice(0, 5).map((anomaly, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{anomaly.anomaly_type || 'Unusual Pattern'}</p>
                  <p className="text-sm text-muted-foreground">{anomaly.description || 'Detected anomaly'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={anomaly.severity === 'critical' ? 'destructive' : 'secondary'}
                  >
                    {anomaly.statistical_score?.toFixed(1) || '0'}% Score
                  </Badge>
                  {anomaly.is_confirmed && <Badge className="bg-green-500">Confirmed</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
