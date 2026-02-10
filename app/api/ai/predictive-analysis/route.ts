import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "This feature is temporarily unavailable." },
    { status: 503 }
  )
}

/*
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { model } from "@/lib/ai/model"
import { performOCR } from "@/lib/ai/ocr-utils"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const budgetFile = formData.get("file") as File
    const department = formData.get("department") as string || "General"
    const historicalSpending = formData.get("historicalSpending") as string // JSON string

    if (!budgetFile) {
      return NextResponse.json({ error: "Budget file required" }, { status: 400 })
    }

    const budgetOCR = await performOCR(budgetFile)

    const prompt = `You are a financial forecasting AI for government audits. Analyze this department's budget and predict potential issues.

DEPARTMENT: ${department}
BUDGET TEXT FROM OCR:
${budgetOCR.extractedText}

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

    const { text } = await generateText({
      model,
      prompt,
    })

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
