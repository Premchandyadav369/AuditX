'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CaseManagement() {
  const [cases, setCases] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState('all')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCases = async () => {
      const { data } = await supabase
        .from('fraud_cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setCases(data)
      }
    }

    fetchCases()
  }, [supabase])

  const filteredCases = filterStatus === 'all' ? cases : cases.filter((c) => c.status === filterStatus)

  const caseStats = {
    open: cases.filter((c) => c.status === 'open').length,
    investigating: cases.filter((c) => c.status === 'investigating').length,
    resolved: cases.filter((c) => c.status === 'resolved').length,
    total: cases.length,
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investigation Cases</h1>
          <p className="text-muted-foreground">Full lifecycle case tracking</p>
        </div>
        <Button>+ New Case</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseStats.open}</div>
            <p className="text-xs text-muted-foreground">Awaiting investigation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Investigating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseStats.investigating}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{caseStats.resolved}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseStats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Case List
            </CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cases</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCases.slice(0, 10).map((caseItem, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{caseItem.case_number}</p>
                    <Badge variant="outline">{caseItem.fraud_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{caseItem.title}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {caseItem.assigned_to ? 'Assigned' : 'Unassigned'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(caseItem.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    className={
                      caseItem.status === 'resolved'
                        ? 'bg-green-500'
                        : caseItem.status === 'investigating'
                          ? 'bg-blue-500'
                          : 'bg-orange-500'
                    }
                  >
                    {caseItem.status}
                  </Badge>
                  {caseItem.recovered_amount && (
                    <span className="text-sm font-semibold">
                      ₹{(caseItem.recovered_amount / 10000000).toFixed(1)}Cr
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
