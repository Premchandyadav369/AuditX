import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { model } from "@/lib/ai/model"

export async function POST(req: NextRequest) {
  try {
    const { entityA, entityB, comparisonType } = await req.json()

    if (!entityA || !entityB || !comparisonType) {
      return NextResponse.json({ error: "Both entities and comparison type required" }, { status: 400 })
    }

    const prompt = `Compare these two ${comparisonType}s and provide comprehensive analysis.

ENTITY A:
${JSON.stringify(entityA, null, 2)}

ENTITY B:
${JSON.stringify(entityB, null, 2)}

Generate comparison in JSON:
{
  "overallAssessment": "which is more favorable and why",
  "sideBySide": {
    "metric": ["list of comparison metrics"],
    "entityA": ["values for entity A"],
    "entityB": ["values for entity B"],
    "winner": ["which is better for each metric"]
  },
  "riskComparison": {
    "entityA": {"score": number, "factors": []},
    "entityB": {"score": number, "factors": []}
  },
  "pricingAnalysis": {
    "entityA": "pricing details",
    "entityB": "pricing details",
    "variance": "percentage difference",
    "marketComparison": "compared to market rates"
  },
  "patterns": {
    "similarities": ["what they have in common"],
    "differences": ["key differences"],
    "concerns": ["red flags in either"]
  },
  "recommendation": {
    "preferred": "A or B",
    "reasoning": "detailed explanation",
    "conditions": ["any conditions or caveats"],
    "alternatives": ["other options to consider"]
  }
}`

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.5,
      maxTokens: 4000,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const comparison = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return NextResponse.json({
      success: true,
      comparison,
    })
  } catch (error) {
    console.error("[v0] Comparative analysis error:", error)
    return NextResponse.json({ error: "Comparative analysis failed" }, { status: 500 })
  }
}
