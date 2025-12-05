import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyBZP3AK10xyB7jW6vbBwZs4UBh-VUqpmoQ")

export async function POST(req: NextRequest) {
  try {
    const { budgetData, historicalSpending, department } = await req.json()

    if (!budgetData || !department) {
      return NextResponse.json({ error: "Budget data and department required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `You are a financial forecasting AI for government audits. Analyze this department's budget and predict potential issues.

DEPARTMENT: ${department}
BUDGET: ${JSON.stringify(budgetData, null, 2)}
HISTORICAL SPENDING: ${JSON.stringify(historicalSpending || {}, null, 2)}

Provide predictive analysis in JSON:
{
  "overrunRisk": number (0-100),
  "predictions": [
    {
      "category": "budget category",
      "allocatedBudget": "amount",
      "predictedSpending": "forecasted amount",
      "variance": "difference",
      "probability": number (0-100),
      "reasoning": "why this prediction"
    }
  ],
  "fraudRiskAreas": [
    {
      "area": "specific spending category",
      "riskLevel": "critical" | "high" | "medium" | "low",
      "indicators": ["warning signs"],
      "preventiveMeasures": ["recommendations"]
    }
  ],
  "spendingTrends": {
    "increasing": ["categories with increasing trend"],
    "decreasing": ["categories with decreasing trend"],
    "volatile": ["categories with high variance"]
  },
  "recommendations": ["strategic recommendations"],
  "timeline": [
    {
      "month": "month name",
      "expectedIssues": ["potential problems"],
      "checkpoints": ["what to monitor"]
    }
  ]
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("[v0] Predictive analysis error:", error)
    return NextResponse.json({ error: "Predictive analysis failed" }, { status: 500 })
  }
}
