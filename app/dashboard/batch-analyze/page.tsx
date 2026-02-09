"use client"

import type React from "react"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, AlertTriangle, CheckCircle, XCircle, Download } from "lucide-react"

export default function BatchAnalyzePage() {
  const [files, setFiles] = useState<File[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      setResults(null)
    }
  }

  const handleBatchAnalyze = async () => {
    if (files.length === 0) return

    setAnalyzing(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 500)

    try {
      const documents = files.map((file, index) => ({
        id: `doc-${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
      }))

      const response = await fetch("/api/ai/batch-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents }),
      })

      const data = await response.json()
      setResults(data)
      setProgress(100)
    } catch (error) {
      console.error("[v0] Batch analyze error:", error)
    } finally {
      clearInterval(progressInterval)
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Batch Document Analysis</h1>
          <p className="text-muted-foreground">Upload multiple documents for simultaneous AI-powered analysis</p>
        </div>

        {/* Upload Section */}
        <Card className="p-8 mb-8">
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Upload Documents</h3>
            <p className="text-muted-foreground mb-4">Select 10-100 documents for batch analysis</p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="batch-upload"
            />
            <label htmlFor="batch-upload">
              <Button asChild>
                <span>Select Files</span>
              </Button>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Selected Files ({files.length})</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="flex-1 text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
              <Button onClick={handleBatchAnalyze} disabled={analyzing} className="mt-4 w-full">
                {analyzing ? "Analyzing..." : `Analyze ${files.length} Documents`}
              </Button>
            </div>
          )}

          {analyzing && (
            <div className="mt-6">
              <Progress value={progress} className="mb-2" />
              <p className="text-sm text-center text-muted-foreground">Processing {progress}% complete...</p>
            </div>
          )}
        </Card>

        {/* Results Section */}
        {results && (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Documents</p>
                    <p className="text-2xl font-bold">{results.summary?.totalDocuments || 0}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Successfully Analyzed</p>
                    <p className="text-2xl font-bold">{results.summary?.successfulAnalyses || 0}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                  <div>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                    <p className="text-2xl font-bold">{results.summary?.highRiskDocuments || 0}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Download className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">{results.summary?.totalAmount || "₹0"}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Detailed Results */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Detailed Analysis Results</h3>
              <div className="space-y-4">
                {results.results?.map((result: any, index: number) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                        <span className="font-medium">{result.documentId}</span>
                      </div>
                      {result.success && result.analysis?.fraudRiskScore && (
                        <Badge
                          variant={result.analysis.fraudRiskScore > 70 ? "destructive" : "default"}
                          className="ml-auto"
                        >
                          Risk: {result.analysis.fraudRiskScore}
                        </Badge>
                      )}
                    </div>
                    {result.success && result.analysis && (
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Vendor: </span>
                          <span className="font-medium">{result.analysis.vendor || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount: </span>
                          <span className="font-medium">{result.analysis.amount || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type: </span>
                          <span className="font-medium">{result.analysis.documentType || "N/A"}</span>
                        </div>
                      </div>
                    )}
                    {!result.success && <p className="text-sm text-destructive">{result.error}</p>}
                  </div>
                ))}
              </div>
              <Button className="mt-6 w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
