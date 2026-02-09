import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { model } from "@/lib/ai/model"
import { simulateOCR } from "@/lib/ai/ocr-utils"

export async function POST(req: NextRequest) {
  try {
    const { contractData, invoiceData } = await req.json()

    if (!contractData || !invoiceData) {
      return NextResponse.json({ error: "Both contract and invoice data required" }, { status: 400 })
    }

    const contractOCR = simulateOCR(contractData.name, contractData.type)
    const invoiceOCR = Array.isArray(invoiceData)
      ? invoiceData.map((inv: any) => simulateOCR(inv.name, inv.type))
      : [simulateOCR(invoiceData.name, invoiceData.type)]

    const prompt = `You are a government audit expert. Compare this contract with the invoice and identify discrepancies.

CONTRACT DATA:
${JSON.stringify(contractOCR, null, 2)}

INVOICE DATA:
${JSON.stringify(invoiceOCR, null, 2)}

Analyze and return JSON with:
{
  "isCompliant": boolean,
  "complianceScore": number (0-100),
  "discrepancies": [
    {
      "type": "overbilling" | "unauthorized_charge" | "quantity_mismatch" | "price_variance" | "terms_violation",
      "severity": "critical" | "high" | "medium" | "low",
      "description": "detailed explanation",
      "contractValue": "value from contract",
      "invoiceValue": "value from invoice",
      "financialImpact": "amount in rupees"
    }
  ],
  "authorizedAmount": "as per contract",
  "invoicedAmount": "as per invoice",
  "excessCharged": "difference if any",
  "recommendations": ["action items"],
  "summary": "brief overall assessment"
}`

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const validation = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return NextResponse.json({
      success: true,
      validation,
    })
  } catch (error) {
    console.error("[v0] Contract validation error:", error)
    return NextResponse.json({ error: "Validation failed" }, { status: 500 })
  }
}
