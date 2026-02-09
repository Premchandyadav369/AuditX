import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { reportType, dateRange, department, filters } = await req.json()

    const supabase = createServerClient()

    // Fetch comprehensive data based on filters
    let query = supabase
      .from("transactions")
      .select(
        `
      *,
      vendors (name, risk_score, category),
      documents (file_name, extracted_data)
    `,
      )
      .order("created_at", { ascending: false })

    if (dateRange?.start) {
      query = query.gte("transaction_date", dateRange.start)
    }
    if (dateRange?.end) {
      query = query.lte("transaction_date", dateRange.end)
    }
    if (department && department !== "all") {
      query = query.eq("department", department)
    }

    const { data: transactions } = await query

    const { data: fraudCases } = await supabase
      .from("fraud_cases")
      .select("*")
      .order("created_at", { ascending: false })

    const { data: complianceViolations } = await supabase
      .from("policy_violations")
      .select("*")
      .order("created_at", { ascending: false })

    const prompt = `You are a senior government audit analyst. Generate a comprehensive ${reportType} audit report.

DATA SUMMARY:
- Total Transactions: ${transactions?.length || 0}
- Department: ${department || "All Departments"}
- Date Range: ${dateRange?.start || "All Time"} to ${dateRange?.end || "Present"}

TRANSACTIONS DATA:
${JSON.stringify(transactions?.slice(0, 50), null, 2)}

FRAUD CASES:
${JSON.stringify(fraudCases?.slice(0, 20), null, 2)}

COMPLIANCE VIOLATIONS:
${JSON.stringify(complianceViolations?.slice(0, 20), null, 2)}

Generate a professional audit report with:
1. Executive Summary
2. Key Findings & Statistics
3. Fraud & Risk Analysis
4. Department Performance
5. Compliance Status
6. Top Vendors & Risk Assessment
7. Spending Trends & Patterns
8. Recommendations & Action Items
9. Appendices with detailed data

Format as markdown with proper headers, tables, and bullet points. Include specific numbers and percentages from the data.`

    const { text: reportContent } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt,
      temperature: 0.5,
      maxTokens: 4000,
    })

    return NextResponse.json({
      success: true,
      report: reportContent,
      metadata: {
        reportType,
        generatedAt: new Date().toISOString(),
        dataPoints: {
          transactions: transactions?.length || 0,
          fraudCases: fraudCases?.length || 0,
          violations: complianceViolations?.length || 0,
        },
      },
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json(
      {
        error: "Report generation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
