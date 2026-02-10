import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { model } from "@/lib/ai/model"
import { z } from "zod"

export async function POST(req: NextRequest) {
  try {
    const { companyName, searchType } = await req.json()

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    let systemPrompt = "You are an expert business intelligence and risk assessment AI."
    let prompt = ""
    let schema: z.ZodType<any> = z.any()

    if (searchType === "compliance") {
      prompt = `Provide a comprehensive compliance report for "${companyName}". Include regulatory compliance status, blacklists, legal cases, certifications, audit findings, and news items. Estimate a risk score from 0-100.`
      schema = z.object({
        companyName: z.string(),
        compliance_status: z.string(),
        blacklists: z.array(z.string()),
        legal_cases: z.array(z.string()),
        certifications: z.array(z.string()),
        audit_findings: z.array(z.string()),
        news_items: z.array(z.string()),
        overall_risk_score: z.number(),
        recommendation: z.string(),
      })
    } else if (searchType === "misconduct") {
      prompt = `Search for any misconduct, fraud, or suspicious activities related to "${companyName}". Include fraud cases, corruption scandals, financial irregularities, complaints, and investigations. Assess severity.`
      schema = z.object({
        companyName: z.string(),
        fraud_cases: z.array(z.string()),
        corruption: z.array(z.string()),
        financial_issues: z.array(z.string()),
        complaints: z.array(z.string()),
        investigations: z.array(z.string()),
        court_cases: z.array(z.string()),
        severity: z.enum(["low", "medium", "high", "critical"]),
        summary: z.string(),
      })
    } else {
      prompt = `Provide comprehensive information about "${companyName}".
      Include company overview, financial health, reputation, government contracts, and risk indicators.
      Specifically include verification status for GST and PAN if available.
      Estimate an overall risk score from 0-100.`
      schema = z.object({
        companyName: z.string(),
        overview: z.string(),
        financial_health: z.string(),
        reputation: z.string(),
        gst_pan_status: z.string().optional(),
        contracts: z.array(z.string()),
        risk_indicators: z.array(z.string()),
        news: z.array(z.string()),
        overall_risk_score: z.number(),
      })
    }

    const { object } = await generateObject({
      model,
      system: systemPrompt,
      prompt,
      schema,
    })

    return NextResponse.json(object)
  } catch (error: any) {
    console.error("Company intelligence error:", error)
    return NextResponse.json({
      error: error.message || "Failed to fetch company intelligence",
      parsed: false,
      companyName: "Error"
    }, { status: 500 })
  }
}
