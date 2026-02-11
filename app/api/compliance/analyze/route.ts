import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { model } from "@/lib/ai/model"

export async function POST(request: NextRequest) {
  try {
    const { query, analysisType } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    console.log("[v0] Compliance analysis requested:", { query, analysisType })

    let prompt = ""

    // Generate prompts based on analysis type
    switch (analysisType) {
      case "vendor":
        prompt = `You are a compliance and risk assessment expert. Analyze the following vendor and provide a comprehensive risk assessment.

Vendor: ${query}

Provide analysis in JSON format with ONLY these exact fields:
{
  "vendorName": "vendor name",
  "riskScore": 0-100 number,
  "compliance": 0-100 number percentage,
  "history": "detailed background of vendor, any history of issues, compliance record",
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"]
}

Base risk score on: payment history, compliance record, fraud history, financial stability, regulatory issues.
Base compliance on: policy adherence, audit results, violations, certifications.`
        break

      case "policy":
        prompt = `You are a policy compliance auditor. Analyze the following department or entity for policy compliance.

Department/Entity: ${query}

Provide analysis in JSON format with ONLY these exact fields:
{
  "department": "department name",
  "compliance": 0-100 number percentage,
  "violations": ["violation 1", "violation 2", "violation 3"],
  "requiredImprovements": ["improvement 1", "improvement 2", "improvement 3"]
}

Assess against standard audit policies, financial controls, documentation requirements, approval processes, segregation of duties.`
        break

      case "regulatory":
        prompt = `You are a regulatory compliance specialist. Analyze the following for regulatory compliance requirements and status.

Subject: ${query}

Provide analysis in JSON format with ONLY these exact fields:
{
  "regulations": ["regulation 1", "regulation 2", "regulation 3"],
  "status": "Compliant | At Risk | Non-Compliant | Pending Review",
  "timeline": "summary of timeline and deadlines",
  "nextSteps": ["step 1 with timeline", "step 2 with timeline", "step 3 with timeline"]
}

Consider: government regulations, audit requirements, financial reporting standards, data protection laws, anti-corruption laws.`
        break

      case "heatmap":
        prompt = `You are a risk geography specialist. Create a risk heatmap for the following query.

Query: ${query}

Provide analysis in JSON format with ONLY these exact fields:
{
  "regions": [
    {
      "name": "region name",
      "riskLevel": "Critical | High | Medium | Low",
      "score": 0-100 number
    }
  ],
  "topRisks": ["risk factor 1", "risk factor 2", "risk factor 3"],
  "mitigation": ["mitigation strategy 1", "mitigation strategy 2", "mitigation strategy 3"]
}

Identify geographic areas with highest risk based on vendor distribution, fraud patterns, regulatory environment, political stability.`
        break

      default:
        prompt = `You are a comprehensive compliance and risk analyst. Analyze the following across all compliance dimensions.

Query: ${query}

Provide balanced analysis in JSON format with ONLY these exact fields:
{
  "vendorRisk": {
    "vendorName": "name",
    "riskScore": 0-100,
    "compliance": 0-100,
    "history": "background",
    "recommendations": ["rec1", "rec2"]
  },
  "policyCompliance": {
    "department": "name",
    "compliance": 0-100,
    "violations": ["v1", "v2"],
    "requiredImprovements": ["imp1", "imp2"]
  }
}`
    }

    console.log("[v0] Generated prompt for analysis type:", analysisType)

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3,
      maxTokens: 2000,
    })

    console.log("[v0] Gemini response received, parsing JSON")

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    let analysis = null

    if (jsonMatch) {
      analysis = JSON.parse(jsonMatch[0])
    } else {
      // Fallback structure
      analysis = {
        vendorRisk: {
          vendorName: query,
          riskScore: 50,
          compliance: 75,
          history: "Unable to extract detailed analysis",
          recommendations: ["Request additional documentation", "Schedule compliance review"],
        },
        policyCompliance: {
          department: query,
          compliance: 75,
          violations: ["Limited data available"],
          requiredImprovements: ["Conduct full audit"],
        },
        regulatoryStatus: {
          regulations: ["Standard compliance requirements apply"],
          status: "Pending Review",
          timeline: "Quarterly review recommended",
          nextSteps: ["Conduct regulatory audit"],
        },
        riskHeatmap: {
          regions: [
            { name: "Primary", riskLevel: "Medium", score: 50 },
            { name: "Secondary", riskLevel: "Low", score: 30 },
          ],
          topRisks: ["Data availability", "Analysis limitations"],
          mitigation: ["Provide more detailed information"],
        },
      }
    }

    console.log("[v0] Analysis completed successfully for type:", analysisType)

    return NextResponse.json({
      success: true,
      analysisType,
      analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Compliance analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to perform compliance analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
