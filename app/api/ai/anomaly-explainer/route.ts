import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { model } from "@/lib/ai/model"

export async function POST(req: NextRequest) {
  try {
    const { transactionData, historicalData } = await req.json()

    if (!transactionData) {
      return NextResponse.json({ error: "Transaction data required" }, { status: 400 })
    }

    const prompt = `You are a fraud detection AI expert. Explain WHY this transaction is suspicious.

CURRENT TRANSACTION:
${JSON.stringify(transactionData, null, 2)}

HISTORICAL CONTEXT:
${JSON.stringify(historicalData || {}, null, 2)}

Provide a detailed explanation in JSON format:
{
  "anomalyType": "price_anomaly" | "volume_anomaly" | "timing_anomaly" | "pattern_anomaly" | "vendor_risk",
  "riskLevel": "critical" | "high" | "medium" | "low",
  "confidence": number (0-100),
  "explanation": "clear, non-technical explanation for auditors",
  "indicators": [
    {
      "factor": "specific factor",
      "normal": "typical value/pattern",
      "observed": "what was actually seen",
      "deviation": "percentage or degree of deviation"
    }
  ],
  "comparisons": {
    "averageAmount": "typical amount for this type",
    "thisAmount": "current transaction amount",
    "priceVariance": "percentage difference"
  },
  "redFlags": ["list of specific warning signs"],
  "investigationSteps": ["recommended actions to investigate"],
  "similarCases": ["brief descriptions of similar historical frauds if any"]
}`

    const { text } = await generateText({
      model,
      prompt,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const explanation = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return NextResponse.json({
      success: true,
      explanation,
    })
  } catch (error) {
    console.error("[v0] Anomaly explainer error:", error)
    return NextResponse.json({ error: "Explanation generation failed" }, { status: 500 })
  }
}
