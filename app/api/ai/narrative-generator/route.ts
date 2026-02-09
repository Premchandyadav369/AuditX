import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { model } from "@/lib/ai/model"

export async function POST(req: NextRequest) {
  try {
    const { transactionData, vendorData, relatedCases } = await req.json()

    if (!transactionData) {
      return NextResponse.json({ error: "Transaction data required" }, { status: 400 })
    }

    const prompt = `Generate a professional investigation summary suitable for legal proceedings.

TRANSACTION:
${JSON.stringify(transactionData, null, 2)}

VENDOR INFO:
${JSON.stringify(vendorData || {}, null, 2)}

RELATED CASES:
${JSON.stringify(relatedCases || [], null, 2)}

Generate comprehensive narrative in JSON:
{
  "executiveSummary": "brief 2-3 sentence overview",
  "timeline": [
    {
      "date": "ISO date",
      "event": "what happened",
      "evidence": "supporting evidence"
    }
  ],
  "narrative": "detailed chronological narrative in formal language",
  "keyFindings": [
    {
      "finding": "specific finding",
      "evidence": "supporting evidence",
      "significance": "why it matters"
    }
  ],
  "connections": {
    "vendors": ["related vendor connections"],
    "transactions": ["related transaction patterns"],
    "individuals": ["involved parties"]
  },
  "financialImpact": {
    "totalAmount": "rupees",
    "potentialLoss": "estimated loss",
    "recoveryPotential": "potential recovery amount"
  },
  "legalAssessment": "preliminary legal assessment",
  "recommendations": ["next steps for investigation"],
  "attachments": ["list of supporting documents"]
}`

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.5,
      maxTokens: 4000,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const narrative = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return NextResponse.json({
      success: true,
      narrative,
    })
  } catch (error) {
    console.error("[v0] Narrative generation error:", error)
    return NextResponse.json({ error: "Narrative generation failed" }, { status: 500 })
  }
}
