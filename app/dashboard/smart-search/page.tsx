"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SmartSearchPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/ai/smart-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (data.error) throw new Error(data.error)

      setResults(data)
      toast.success("Search completed!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight gradient-text">AI-Powered Smart Search</h2>
        <p className="text-muted-foreground">Ask questions in natural language and get intelligent results</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Natural Language Search
          </CardTitle>
          <CardDescription>
            Try queries like "Show vendors with risk over 80 in Defence" or "Find transactions above 1 crore last month"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your search query in plain English..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">Example queries:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Show all high-risk vendors",
                "Find transactions above 50 lakhs this month",
                "List fraud cases by severity",
                "Show departments with highest spending",
              ].map((example) => (
                <Button key={example} variant="outline" size="sm" onClick={() => setQuery(example)} className="text-xs">
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Results ({results.count})</CardTitle>
            <CardDescription>{results.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.results && results.results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {Object.keys(results.results[0]).map((key) => (
                          <th key={key} className="text-left p-2 text-sm font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.results.map((row: any, i: number) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                          {Object.values(row).map((value: any, j: number) => (
                            <td key={j} className="p-2 text-sm">
                              {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No results found</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
