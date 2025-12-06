"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { RefreshCw, Users, Building2, Receipt, AlertTriangle } from "lucide-react"

interface NetworkNode {
  id: string
  name: string
  type: "vendor" | "department" | "transaction"
  riskLevel: number
  connections: number
}

interface NetworkConnection {
  from: string
  to: string
  weight: number
  suspicious: boolean
}

export default function NetworkGraphPage() {
  const [loading, setLoading] = useState(true)
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [connections, setConnections] = useState<NetworkConnection[]>([])
  const [filterType, setFilterType] = useState<"all" | "suspicious">("all")
  const supabase = createBrowserClient()

  useEffect(() => {
    loadNetworkData()
  }, [])

  const loadNetworkData = async () => {
    setLoading(true)
    try {
      const { data: transactions } = await supabase.from("transactions").select("*, vendors(*)")

      if (transactions) {
        const nodeMap = new Map<string, NetworkNode>()
        const connList: NetworkConnection[] = []

        transactions.forEach((t) => {
          const vendorId = `vendor-${t.vendor_id}`
          const deptId = `dept-${t.department}`

          if (!nodeMap.has(vendorId)) {
            nodeMap.set(vendorId, {
              id: vendorId,
              name: t.vendors?.name || "Unknown Vendor",
              type: "vendor",
              riskLevel: t.vendors?.risk_score || 0,
              connections: 0,
            })
          }

          if (!nodeMap.has(deptId)) {
            nodeMap.set(deptId, {
              id: deptId,
              name: t.department || "Unknown",
              type: "department",
              riskLevel: 0,
              connections: 0,
            })
          }

          nodeMap.get(vendorId)!.connections++
          nodeMap.get(deptId)!.connections++

          connList.push({
            from: deptId,
            to: vendorId,
            weight: t.amount || 0,
            suspicious: (t.fraud_score || 0) > 70,
          })
        })

        setNodes(Array.from(nodeMap.values()))
        setConnections(connList)
      }
    } catch (error) {
      console.error("Error loading network data:", error)
    }
    setLoading(false)
  }

  const filteredConnections = filterType === "suspicious" ? connections.filter((c) => c.suspicious) : connections

  const suspiciousNodes = nodes.filter((n) => filteredConnections.some((c) => c.from === n.id || c.to === n.id))

  const displayNodes = filterType === "suspicious" ? suspiciousNodes : nodes

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Network Graph</h2>
          <p className="text-muted-foreground">Vendor-Department-Transaction relationship mapping</p>
        </div>
        <div className="flex gap-3">
          <Select value={filterType} onValueChange={(v) => setFilterType(v as "all" | "suspicious")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Connections</SelectItem>
              <SelectItem value="suspicious">Suspicious Only</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadNetworkData} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayNodes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {nodes.filter((n) => n.type === "vendor").length} vendors,{" "}
              {nodes.filter((n) => n.type === "department").length} departments
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredConnections.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {connections.filter((c) => c.suspicious).length} suspicious
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Nodes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {displayNodes.filter((n) => n.riskLevel > 70).length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Connections</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayNodes.length > 0
                ? Math.round(displayNodes.reduce((sum, n) => sum + n.connections, 0) / displayNodes.length)
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Vendor Nodes</CardTitle>
            <CardDescription>Vendors in the network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
            {displayNodes
              .filter((n) => n.type === "vendor")
              .map((node) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${node.riskLevel > 70 ? "bg-red-500/20" : "bg-primary/20"}`}
                    >
                      <Building2 className={`w-5 h-5 ${node.riskLevel > 70 ? "text-red-500" : "text-primary"}`} />
                    </div>
                    <div>
                      <p className="font-medium">{node.name}</p>
                      <p className="text-xs text-muted-foreground">{node.connections} connections</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${node.riskLevel > 70 ? "text-red-500" : "text-muted-foreground"}`}
                    >
                      Risk: {node.riskLevel}%
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Department Nodes</CardTitle>
            <CardDescription>Departments in the network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
            {displayNodes
              .filter((n) => n.type === "department")
              .map((node) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{node.name}</p>
                      <p className="text-xs text-muted-foreground">{node.connections} transactions</p>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Network Visualization</CardTitle>
          <CardDescription>Interactive graph coming soon with D3.js/Cytoscape</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center border border-dashed border-border/50 rounded-lg">
          <div className="text-center space-y-4">
            <Users className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">3D Network Visualization</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Interactive force-directed graph visualization will display here with draggable nodes, zoom controls,
                and relationship highlighting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
