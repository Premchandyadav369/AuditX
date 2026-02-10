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
    const contractFile = formData.get("contract") as File
    const invoiceFiles = formData.getAll("invoices") as File[]

    if (!contractFile || invoiceFiles.length === 0) {
      return NextResponse.json({ error: "Both contract and invoice files are required" }, { status: 400 })
    }

    // Perform real OCR
    const contractOCR = await performOCR(contractFile)
    const invoicesOCR = await Promise.all(invoiceFiles.map(file => performOCR(file)))

    const prompt = `You are a government audit expert. Compare this contract with the invoice(s) and identify discrepancies.

CONTRACT TEXT:
${contractOCR.extractedText}

INVOICE(S) TEXT:
${invoicesOCR.map((ocr, i) => `INVOICE ${i + 1}:\n${ocr.extractedText}`).join("\n\n")}

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
