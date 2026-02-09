'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Clock, Mail, Plus, Download } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AutoReports() {
  const [reports, setReports] = useState<any[]>([])
  const [scheduled, setScheduled] = useState<any[]>([])
  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchReports = async () => {
      const { data: reportsData } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      const { data: scheduledData } = await supabase
        .from('scheduled_reports')
        .select('*')
        .eq('is_active', true)

      if (reportsData) setReports(reportsData)
      if (scheduledData) setScheduled(scheduledData)
    }

    fetchReports()
  }, [supabase])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automated Report Generation</h1>
          <p className="text-muted-foreground">Schedule & generate reports with AI</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">This fiscal year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduled.length}</div>
            <p className="text-xs text-muted-foreground">Active schedules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Generation Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 24s</div>
            <p className="text-xs text-green-600">-12% faster than last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scheduled Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduled.slice(0, 5).map((schedule, i) => (
              <div key={i} className="space-y-2 border-b pb-3 last:border-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{schedule.name}</p>
                  <Badge className="bg-blue-500">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Recipients: {schedule.recipients ? schedule.recipients.length : 0}
                  </span>
                  <span>Next run: {new Date(schedule.next_run_at).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 bg-transparent">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7">
                    Pause
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Generate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Report Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Audit Report</SelectItem>
                  <SelectItem value="quarterly">Quarterly Summary</SelectItem>
                  <SelectItem value="annual">Annual Compliance Report</SelectItem>
                  <SelectItem value="fraud">Fraud Detection Report</SelectItem>
                  <SelectItem value="vendor">Vendor Risk Report</SelectItem>
                  <SelectItem value="budget">Budget Variance Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Department</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="defence">Defence</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {reports.slice(0, 8).map((report, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{report.report_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{report.report_type}</Badge>
                  <Badge
                    className={
                      report.status === 'completed'
                        ? 'bg-green-500'
                        : report.status === 'processing'
                          ? 'bg-blue-500'
                          : 'bg-gray-500'
                    }
                  >
                    {report.status}
                  </Badge>
                  {report.status === 'completed' && (
                    <Button variant="ghost" size="sm" className="h-7 gap-1">
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
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
