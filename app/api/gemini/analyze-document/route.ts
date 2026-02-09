import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString("base64")

    // Determine MIME type
    const mimeType = file.type || "application/pdf"

    // Use Groq for document analysis
    const prompt = `You are an expert fraud auditor for the Government of India. Analyze this financial document in detail.

Extract the following information in JSON format:
{
  "documentType": "invoice|receipt|purchase_order|contract|expense_report",
  "vendor": {
    "name": "vendor name",
    "address": "full address",
    "taxId": "GST/PAN number",
    "contactInfo": "email or phone"
  },
  "financial": {
    "totalAmount": numeric value,
    "currency": "INR",
    "taxAmount": tax amount,
    "subtotal": subtotal,
    "paymentTerms": "payment terms"
  },
  "documentDetails": {
    "documentNumber": "invoice/receipt number",
    "date": "YYYY-MM-DD",
    "dueDate": "YYYY-MM-DD",
    "referenceNumber": "PO or reference"
  },
  "lineItems": [
    {
      "description": "item description",
      "quantity": number,
      "unitPrice": number,
      "amount": number
    }
  ],
  "parties": {
    "buyer": "government department",
    "seller": "vendor name",
    "shippingAddress": "if applicable"
  },
  "fraudIndicators": {
    "duplicateRisk": boolean,
    "priceAnomalyRisk": boolean,
    "vendorRisk": boolean,
    "missingFieldsRisk": boolean,
    "riskScore": 0-100,
    "riskReasons": ["reason 1", "reason 2"]
  },
  "confidence": 0-100,
  "additionalNotes": "any suspicious patterns or concerns"
}

Analyze for fraud indicators like:
- Duplicate invoice numbers
- Unusual amounts or pricing
- Missing critical information
- Suspicious vendor details
- Altered or tampered documents
- Round numbers (common in fraud)
- Weekend/holiday transactions
- Same-day multiple transactions

Be thorough and flag any concerns.`

    const documentPrompt = `${prompt}

Document content (base64): ${base64Data.substring(0, 500)}...`

    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt: documentPrompt,
      temperature: 0.3,
    })

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response")
    }

    const extractedData = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      success: true,
      data: extractedData,
      rawResponse: text,
    })
  } catch (error) {
    console.error("Gemini analysis error:", error)
    return NextResponse.json(
      {
        error: "Document analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
