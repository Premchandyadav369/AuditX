'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function RegulatoryCompliance() {
  const [violations, setViolations] = useState<any[]>([])
  const [compliance, setCompliance] = useState({
    gfr2017: 95,
    cag: 87,
    cvc: 92,
    overall: 91,
  })
  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchViolations = async () => {
      const { data } = await supabase
        .from('policy_violations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setViolations(data)
      }
    }

    fetchViolations()
  }, [supabase])

  const complianceFrameworks = [
    { name: 'GFR 2017', score: compliance.gfr2017, color: 'bg-blue-500' },
    { name: 'CAG Guidelines', score: compliance.cag, color: 'bg-purple-500' },
    { name: 'CVC Standards', score: compliance.cvc, color: 'bg-green-500' },
    { name: 'Overall', score: compliance.overall, color: 'bg-orange-500', bold: true },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Regulatory Compliance</h1>
        <p className="text-muted-foreground">Government audit framework tracking</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {complianceFrameworks.map((fw) => (
          <Card key={fw.name}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{fw.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={fw.bold ? 'text-3xl font-bold' : 'text-2xl font-bold'}>
                {fw.score}%
              </div>
              <Progress value={fw.score} className="mt-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {fw.score >= 90 ? '✓ Compliant' : '⚠ Review needed'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Completed Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Annual audit completion',
              'Fund transfer documentation',
              'Vendor verification',
              'Budget reconciliation',
              'Department reporting',
            ].map((req, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">{req}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Pending Compliance Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { item: 'Q4 Compliance Report', due: '5 days', status: 'urgent' },
              { item: 'Vendor Risk Assessment', due: '2 weeks', status: 'warning' },
              { item: 'Internal Audit Updates', due: '1 month', status: 'normal' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.item}</p>
                  <p className="text-xs text-muted-foreground">Due: {item.due}</p>
                </div>
                <Badge
                  variant={
                    item.status === 'urgent'
                      ? 'destructive'
                      : item.status === 'warning'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Policy Violations ({violations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {violations.slice(0, 5).map((violation, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm">{violation.policy_name}</p>
                  <p className="text-xs text-muted-foreground">{violation.violation_type}</p>
                </div>
                <Badge
                  variant={
                    violation.severity === 'critical'
                      ? 'destructive'
                      : violation.severity === 'high'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {violation.status === 'resolved' ? 'Resolved' : violation.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
