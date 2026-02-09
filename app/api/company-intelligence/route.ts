import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { model } from "@/lib/ai/model"

export async function POST(req: NextRequest) {
  try {
    const { companyName, searchType } = await req.json()

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    let prompt = ""
    if (searchType === "compliance") {
      prompt = `Search the internet and provide a comprehensive compliance report for "${companyName}". Include:
1. Regulatory Compliance Status (GST, PAN, licenses)
2. Government Blacklists or Sanctions
3. Legal Cases or Violations
4. Industry Certifications
5. Audit Reports (if public)
6. Recent News about compliance issues

Format as JSON with sections: companyName, compliance_status, blacklists, legal_cases, certifications, audit_findings, news_items, risk_score (0-100), recommendation`
    } else if (searchType === "misconduct") {
      prompt = `Search the internet for any misconduct, fraud, or suspicious activities related to "${companyName}". Include:
1. Fraud Cases or Allegations
2. Corruption Scandals
3. Financial Irregularities
4. Vendor Complaints
5. Employee Whistleblower Reports
6. Media Investigations
7. Court Cases

Format as JSON with sections: companyName, fraud_cases, corruption, financial_issues, complaints, investigations, court_cases, severity (low/medium/high/critical), summary`
    } else {
      prompt = `Search the internet and provide comprehensive information about "${companyName}". Include:
1. Company Overview (type, registration, location)
2. Financial Health
3. Reputation Score
4. Government Contracts History
5. Risk Indicators
6. Recent News

Format as JSON with sections: companyName, overview, financial_health, reputation, contracts, risk_indicators, news, overall_risk_score (0-100)`
    }

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3,
    })

    // Parse JSON from response
    let data
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[1])
      } else {
        data = JSON.parse(text)
      }
    } catch (e) {
      // If parsing fails, return the raw text
      data = {
        companyName,
        raw_response: text,
        parsed: false,
      }
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Company intelligence error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch company intelligence" }, { status: 500 })
  }
}
