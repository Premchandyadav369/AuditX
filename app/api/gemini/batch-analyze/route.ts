import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: NextRequest) {
  try {
    const { documents } = await req.json()

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json({ error: "Documents array is required" }, { status: 400 })
    }

    const results = []

    for (const doc of documents) {
      try {
        const prompt = `Analyze this financial document and extract:
1. Document type (invoice/receipt/purchase order/contract)
2. Vendor name and details
3. Amount and currency
4. Date
5. Line items with quantities and prices
6. Fraud risk score (0-100) with reasoning
7. Any suspicious indicators

Document data: ${JSON.stringify(doc)}

Return as JSON with keys: documentType, vendor, amount, date, items, fraudRiskScore, suspiciousIndicators, summary`

        const { text } = await generateText({
          model: groq("mixtral-8x7b-32768"),
          prompt,
          temperature: 0.3,
        })

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null

        results.push({
          documentId: doc.id || doc.name,
          success: true,
          analysis,
        })
      } catch (error) {
        results.push({
          documentId: doc.id || doc.name,
          success: false,
          error: error instanceof Error ? error.message : "Analysis failed",
        })
      }
    }

    // Calculate aggregated insights
    const totalDocuments = results.length
    const successfulAnalyses = results.filter((r) => r.success).length
    const highRiskDocuments = results.filter((r) => r.success && r.analysis?.fraudRiskScore > 70).length
    const totalAmount = results
      .filter((r) => r.success && r.analysis?.amount)
      .reduce((sum, r) => sum + Number.parseFloat(r.analysis.amount.replace(/[^\d.]/g, "")), 0)

    return NextResponse.json({
      success: true,
      results,
      summary: {
        totalDocuments,
        successfulAnalyses,
        highRiskDocuments,
        totalAmount: `₹${totalAmount.toLocaleString("en-IN")}`,
        averageRiskScore: Math.round(
          results
            .filter((r) => r.success && r.analysis?.fraudRiskScore)
            .reduce((sum, r) => sum + r.analysis.fraudRiskScore, 0) / successfulAnalyses || 0,
        ),
      },
    })
  } catch (error) {
    console.error("[v0] Batch analysis error:", error)
    return NextResponse.json({ error: "Batch analysis failed" }, { status: 500 })
  }
}
