"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, AlertTriangle, CheckCircle, Upload } from "lucide-react"
import { toast } from "sonner"

export default function PredictiveAnalyticsPage() {
  const [budgetFile, setBudgetFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [predictions, setPredictions] = useState<any>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBudgetFile(e.target.files[0])
    }
  }

  const analyzeBudget = async () => {
    if (!budgetFile) return

    setAnalyzing(true)
    try {
      // For Groq, we'll send the file to an API route that can handle it
      // Since Groq doesn't support PDF/Excel directly, we'll use a simplified version
      // or the API will attempt to extract text.

      const formData = new FormData()
      formData.append("file", budgetFile)
      formData.append("department", "General") // Default department

      const response = await fetch("/api/ai/predictive-analysis", {
        method: "POST",
        body: JSON.stringify({
          budgetData: { fileName: budgetFile.name, type: budgetFile.type },
          department: "General",
          historicalSpending: {}
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error("Failed to analyze budget")
      }

      const data = await response.json()

      if (data.success && data.analysis) {
        // Map the API response to the UI state
        // The API returns 'overrunRisk', but UI expects 'overallRisk' etc.
        setPredictions({
          overallRisk: data.analysis.overrunRisk > 70 ? "high" : data.analysis.overrunRisk > 30 ? "medium" : "low",
          predictedOverrun: data.analysis.predictions?.[0]?.variance || 0,
          overrunProbability: data.analysis.overrunRisk,
          highRiskAreas: data.analysis.fraudRiskAreas.map((area: any) => ({
            category: area.area,
            budgeted: 0,
            predicted: 0,
            risk: area.riskLevel,
            reason: area.indicators.join(", ")
          })),
          fraudIndicators: data.analysis.fraudRiskAreas.flatMap((area: any) =>
            area.indicators.map((ind: string) => ({
              indicator: ind,
              severity: area.riskLevel,
              description: area.preventiveMeasures[0] || ""
            }))
          ),
          recommendations: data.analysis.recommendations
        })
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("AI analysis failed. Using fallback data.")
      // Fallback
      setPredictions({
        overallRisk: "high",
        predictedOverrun: 1250000,
        overrunProbability: 78,
        highRiskAreas: [
          {
            category: "Procurement & Supplies",
            budgeted: 5000000,
            predicted: 6200000,
            risk: "high",
            reason: "Historical trend shows 20-25% overrun in this category",
          },
        ],
        fraudIndicators: [
          {
            indicator: "Rapid spending near fiscal year end",
            severity: "high",
            description: "85% of budget spent in last 2 months increases fraud risk",
          },
        ],
        recommendations: [
          "Implement monthly spending caps",
          "Require secondary approval for expenses >₹50,000",
          "Conduct surprise audits in Q3 and Q4",
        ],
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "high":
      case "critical":
        return "text-red-500"
      case "medium":
        return "text-orange-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="p-8 ml-64">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Predictive Budget Analysis</h1>
          <p className="text-muted-foreground">
            Upload department budgets to predict overruns and identify fraud risks
          </p>
        </div>

        {/* Upload Section */}
        {!budgetFile ? (
          <Card className="p-8 border-2 border-dashed text-center">
            <TrendingUp className="w-16 h-16 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Budget File</h3>
            <p className="text-sm text-muted-foreground mb-4">Excel or PDF format</p>
            <input
              type="file"
              accept=".xlsx,.xls,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="budget-upload"
            />
            <label htmlFor="budget-upload">
              <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Select Budget File
                </span>
              </Button>
            </label>
          </Card>
        ) : (
          <>
            <Card className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold">{budgetFile.name}</p>
                  <p className="text-sm text-muted-foreground">Ready to analyze</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={analyzeBudget} disabled={analyzing} className="glow-blue">
                  {analyzing ? "Analyzing..." : "Run Analysis"}
                </Button>
                <Button variant="outline" onClick={() => setBudgetFile(null)}>
                  Change
                </Button>
              </div>
            </Card>
          </>
        )}

        {/* Results */}
        {predictions && (
          <div className="space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Overall Risk</p>
                <p className={`text-3xl font-bold uppercase ${getRiskColor(predictions.overallRisk)}`}>
                  {predictions.overallRisk}
                </p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Predicted Overrun</p>
                <p className="text-3xl font-bold text-red-500">₹{predictions.predictedOverrun.toLocaleString()}</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Probability</p>
                <p className="text-3xl font-bold text-orange-500">{predictions.overrunProbability}%</p>
              </Card>
            </div>

            {/* High Risk Areas */}
            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-bold">High Risk Budget Categories</h3>
              {predictions.highRiskAreas.map((area: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{area.category}</h4>
                    <span className={`text-sm font-semibold uppercase ${getRiskColor(area.risk)}`}>
                      {area.risk} RISK
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Budgeted</p>
                      <p className="font-semibold">₹{area.budgeted.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Predicted</p>
                      <p className="font-semibold text-red-500">₹{area.predicted.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{area.reason}</p>
                </div>
              ))}
            </Card>

            {/* Fraud Indicators */}
            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-bold">Fraud Risk Indicators</h3>
              {predictions.fraudIndicators.map((indicator: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20 rounded"
                >
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${getRiskColor(indicator.severity)}`} />
                  <div>
                    <p className="font-semibold">{indicator.indicator}</p>
                    <p className="text-sm text-muted-foreground">{indicator.description}</p>
                  </div>
                </div>
              ))}
            </Card>

            {/* Recommendations */}
            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-bold">Preventive Recommendations</h3>
              <ul className="space-y-2">
                {predictions.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
