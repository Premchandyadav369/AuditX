"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function ComparePage() {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleCompare = async () => {
    if (!file1 || !file2) return

    setIsComparing(true)
    const formData = new FormData()
    formData.append("file1", file1)
    formData.append("file2", file2)

    try {
      const response = await fetch("/api/ai/compare-documents", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(data.analysis)
    } catch (error) {
      console.error("Comparison error:", error)
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Document Comparison</h1>
            <p className="text-muted-foreground">AI-powered duplicate detection and forensic analysis</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Document 1</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <input
                  type="file"
                  id="file1"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files && setFile1(e.target.files[0])}
                />
                <label htmlFor="file1">
                  <Button variant="outline" asChild>
                    <span>Select Document</span>
                  </Button>
                </label>
                {file1 && <div className="mt-4 text-sm text-foreground">{file1.name}</div>}
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Document 2</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <input
                  type="file"
                  id="file2"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files && setFile2(e.target.files[0])}
                />
                <label htmlFor="file2">
                  <Button variant="outline" asChild>
                    <span>Select Document</span>
                  </Button>
                </label>
                {file2 && <div className="mt-4 text-sm text-foreground">{file2.name}</div>}
              </div>
            </Card>
          </div>

          <div className="flex justify-center mb-6">
            <Button
              onClick={handleCompare}
              disabled={!file1 || !file2 || isComparing}
              className="holographic-gradient glow-blue"
              size="lg"
            >
              {isComparing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing with Gemini AI...
                </>
              ) : (
                "Compare Documents"
              )}
            </Button>
          </div>

          {result && (
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-xl font-bold mb-4">Analysis Results</h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {result.isDuplicate ? (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">Duplicate Detected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-chart-4">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">No Duplicate</span>
                    </div>
                  )}
                  <span className="text-muted-foreground">Similarity: {result.similarityScore}%</span>
                </div>

                {result.suspiciousPatterns.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Suspicious Patterns:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {result.suspiciousPatterns.map((pattern: string, idx: number) => (
                        <li key={idx}>{pattern}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Key Differences:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {result.keyDifferences.map((diff: string, idx: number) => (
                      <li key={idx}>{diff}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Risk Assessment</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        result.riskAssessment.score > 70
                          ? "bg-destructive/10 text-destructive"
                          : result.riskAssessment.score > 40
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-chart-4/10 text-chart-4"
                      }`}
                    >
                      {result.riskAssessment.score}% Risk
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{result.riskAssessment.reasons.join(" • ")}</div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold mb-2">Detailed Analysis:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.detailedAnalysis}</p>
                </div>

                <div className="flex justify-center">
                  <span
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      result.recommendation === "approve"
                        ? "bg-chart-4/10 text-chart-4"
                        : result.recommendation === "investigate"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    Recommendation: {result.recommendation.toUpperCase()}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
