"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createBrowserClient } from "@/lib/supabase/client"
import { RefreshCw, Upload, FileText, AlertTriangle, CheckCircle, Clock, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityEvent {
  id: string
  type: "upload" | "fraud_detected" | "case_created" | "report_generated" | "login"
  title: string
  description: string
  timestamp: string
  user: string
  metadata?: any
}

export default function ActivityTimelinePage() {
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [filter, setFilter] = useState<string>("all")
  const supabase = createBrowserClient()

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    setLoading(true)
    try {
      const events: ActivityEvent[] = []

      // Load documents
      const { data: documents } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      documents?.forEach((doc) => {
        events.push({
          id: `doc-${doc.id}`,
          type: "upload",
          title: "Document Uploaded",
          description: `${doc.document_type || "Document"} uploaded - ${doc.file_name}`,
          timestamp: doc.created_at,
          user: "Auditor",
          metadata: doc,
        })
      })

      // Load fraud cases
      const { data: fraudCases } = await supabase
        .from("fraud_cases")
        .select("*")
        .order("detected_at", { ascending: false })
        .limit(20)

      fraudCases?.forEach((fraud) => {
        events.push({
          id: `fraud-${fraud.id}`,
          type: "fraud_detected",
          title: "Fraud Detected",
          description: `${fraud.fraud_type} - Severity: ${fraud.severity}`,
          timestamp: fraud.detected_at,
          user: "AI System",
          metadata: fraud,
        })
      })

      // Load cases
      const { data: cases } = await supabase
        .from("cases")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      cases?.forEach((c) => {
        events.push({
          id: `case-${c.id}`,
          type: "case_created",
          title: "Case Created",
          description: `${c.title} - Priority: ${c.priority}`,
          timestamp: c.created_at,
          user: c.assigned_to || "Unassigned",
          metadata: c,
        })
      })

      // Sort by timestamp
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setActivities(events)
    } catch (error) {
      console.error("Error loading activities:", error)
    }
    setLoading(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="w-4 h-4" />
      case "fraud_detected":
        return <AlertTriangle className="w-4 h-4" />
      case "case_created":
        return <FileText className="w-4 h-4" />
      case "report_generated":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case "upload":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50"
      case "fraud_detected":
        return "bg-red-500/20 text-red-500 border-red-500/50"
      case "case_created":
        return "bg-purple-500/20 text-purple-500 border-purple-500/50"
      case "report_generated":
        return "bg-green-500/20 text-green-500 border-green-500/50"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/50"
    }
  }

  const filteredActivities = filter === "all" ? activities : activities.filter((a) => a.type === filter)

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Activity Timeline</h2>
          <p className="text-muted-foreground">Complete audit trail of all system activities</p>
        </div>
        <Button onClick={loadActivities} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All Activities
        </Button>
        <Button variant={filter === "upload" ? "default" : "outline"} size="sm" onClick={() => setFilter("upload")}>
          Uploads
        </Button>
        <Button
          variant={filter === "fraud_detected" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("fraud_detected")}
        >
          Fraud Alerts
        </Button>
        <Button
          variant={filter === "case_created" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("case_created")}
        >
          Cases
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Uploaded</CardTitle>
            <Upload className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {activities.filter((a) => a.type === "upload").length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {activities.filter((a) => a.type === "fraud_detected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Chronological view of all system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-4 max-h-[600px] overflow-y-auto pr-4">
            <div className="absolute left-[21px] top-0 bottom-0 w-px bg-border" />

            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="relative pl-12 pb-4">
                <div
                  className={`absolute left-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getColor(activity.type)}`}
                >
                  {getIcon(activity.type)}
                </div>
                <div className="glass-card p-4 hover-glow transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {activity.user}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No activities found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
