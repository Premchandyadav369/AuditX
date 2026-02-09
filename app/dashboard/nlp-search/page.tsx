'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Brain, Search, History, Filter, BarChart3 } from 'lucide-react'

export default function NLPSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    setSearching(true)
    // Simulated search - in production, this calls the Gemini API
    setTimeout(() => {
      setResults([
        {
          type: 'Transaction',
          title: 'High-value payment to TechCorp',
          content: 'Found 12 transactions matching criteria with total value ₹4.5 Cr',
          department: 'IT',
          date: '2024-01-15',
          confidence: 0.94,
        },
        {
          type: 'Vendor',
          title: 'TechCorp - Risk Assessment',
          content: 'Vendor with 87% risk score, 23 transactions in Q3',
          department: 'Procurement',
          date: '2024-01-10',
          confidence: 0.88,
        },
        {
          type: 'Document',
          title: 'Compliance Report - Q3',
          content: 'Annual compliance showing 5 policy violations related to payments',
          department: 'Finance',
          date: '2024-01-05',
          confidence: 0.81,
        },
      ])
      setSearching(false)
    }, 1500)
  }

  const savedQueries = [
    'Find vendors with risk score > 80',
    'Show transactions in Defence ministry > ₹1 Cr',
    'High-risk invoices from last 30 days',
    'Payments with unusual timing patterns',
    'Duplicate payment incidents',
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Advanced NLP Search</h1>
        <p className="text-muted-foreground">Natural language database queries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Natural Language Query
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask anything: 'Find vendors with risk > 80', 'Show high-value invoices from TechCorp', etc."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={searching} className="gap-2">
              <Search className="h-4 w-4" />
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">
              💡 Try: "Show all transactions &gt; ₹50 lakh in Defence ministry", "Find vendors with duplicate invoices",
              "Which departments exceeded budget?", "Compliance violations in Q3"
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>Enter a natural language query to search</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, i) => (
                  <div key={i} className="space-y-2 border rounded-lg p-3 hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{result.type}</Badge>
                          <span className="text-xs font-medium">
                            Confidence: {(result.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="mt-1 font-medium">{result.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{result.content}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{result.department}</span>
                          <span>•</span>
                          <span>{new Date(result.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Saved Queries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {savedQueries.map((sq, i) => (
              <Button
                key={i}
                variant="outline"
                className="w-full justify-start text-left h-auto p-2 bg-transparent"
                onClick={() => setQuery(sq)}
              >
                <span className="line-clamp-2 text-sm">{sq}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Search Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { label: 'Total Searches', value: '1,245' },
              { label: 'Avg Results', value: '3.2' },
              { label: 'Response Time', value: '850ms' },
              { label: 'Search Accuracy', value: '91%' },
            ].map((stat, i) => (
              <div key={i} className="rounded-lg border p-3 text-center">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
