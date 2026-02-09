import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file1 = formData.get("file1") as File
    const file2 = formData.get("file2") as File

    if (!file1 || !file2) {
      return NextResponse.json({ error: "Two files required" }, { status: 400 })
    }

    // Convert files to base64
    const bytes1 = await file1.arrayBuffer()
    const bytes2 = await file2.arrayBuffer()
    const buffer1 = Buffer.from(bytes1)
    const buffer2 = Buffer.from(bytes2)

    const prompt = `You are a forensic document analyst. Compare these two financial documents and identify:

1. Similarities and differences
2. Potential duplicate indicators
3. Suspicious alterations or modifications
4. Inconsistencies in data (amounts, dates, vendor details)
5. Signs of document tampering
6. Risk assessment (0-100)

Provide analysis in JSON format:
{
  "isDuplicate": boolean,
  "similarityScore": 0-100,
  "keyDifferences": ["difference 1", "difference 2"],
  "suspiciousPatterns": ["pattern 1", "pattern 2"],
  "riskAssessment": {
    "score": 0-100,
    "reasons": ["reason 1", "reason 2"]
  },
  "recommendation": "approve|investigate|reject",
  "detailedAnalysis": "comprehensive explanation"
}`

    const docPrompt = `${prompt}\n\nDocument 1 (base64 first 500 chars): ${buffer1.toString("base64").substring(0, 500)}...\nDocument 2 (base64 first 500 chars): ${buffer2.toString("base64").substring(0, 500)}...`

    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt: docPrompt,
      temperature: 0.3,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response")
    }

    const analysis = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      success: true,
      analysis,
      rawResponse: text,
    })
  } catch (error) {
    console.error("Document comparison error:", error)
    return NextResponse.json(
      {
        error: "Document comparison failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
