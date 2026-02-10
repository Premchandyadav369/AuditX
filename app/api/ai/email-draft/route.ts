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

export async function POST(req: NextRequest) {
  try {
    const { caseData, recipient, tone, purpose } = await req.json()

    if (!caseData || !recipient || !purpose) {
      return NextResponse.json({ error: "Case data, recipient, and purpose required" }, { status: 400 })
    }

    const prompt = `Draft a professional government audit email.

CASE DETAILS:
${JSON.stringify(caseData, null, 2)}

RECIPIENT: ${recipient}
TONE: ${tone || "formal"}
PURPOSE: ${purpose}

Generate email in JSON format:
{
  "subject": "clear, professional subject line",
  "body": "complete email body with proper formatting",
  "cc": ["suggested CC recipients"],
  "attachments": ["suggested documents to attach"],
  "priority": "normal" | "high" | "urgent",
  "followUpDate": "suggested follow-up date"
}`

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.5,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const email = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return NextResponse.json({
      success: true,
      email,
    })
  } catch (error) {
    console.error("[v0] Email draft error:", error)
    return NextResponse.json({ error: "Email generation failed" }, { status: 500 })
  }
}
