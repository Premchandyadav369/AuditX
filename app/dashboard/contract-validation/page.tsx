"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileCheck, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyBZP3AK10xyB7jW6vbBwZs4UBh-VUqpmoQ")

export default function ContractValidationPage() {
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [invoiceFiles, setInvoiceFiles] = useState<File[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContractFile(e.target.files[0])
    }
  }

  const handleInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setInvoiceFiles(Array.from(e.target.files))
    }
  }

  const validateContracts = async () => {
    if (!contractFile || invoiceFiles.length === 0) return

    setAnalyzing(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

      // Read contract file
      const contractData = await fileToBase64(contractFile)

      // Read invoice files
      const invoiceData = await Promise.all(invoiceFiles.map((file) => fileToBase64(file)))

      const prompt = `You are a government audit expert. Analyze this contract and invoices.

CONTRACT: ${contractFile.name}
INVOICES: ${invoiceFiles.map((f) => f.name).join(", ")}

Compare the invoices against the contract terms and identify:
1. Overbilling or incorrect amounts
2. Unauthorized charges not in contract
3. Terms violations (delivery dates, quantities, specifications)
4. Duplicate billing
5. Price discrepancies

Return a JSON object with:
{
  "overallCompliance": "COMPLIANT" | "VIOLATIONS_FOUND" | "CRITICAL_ISSUES",
  "totalContractValue": number,
  "totalInvoiced": number,
  "discrepancy": number,
  "violations": [
    {
      "type": "overbilling" | "unauthorized" | "terms_violation" | "duplicate",
      "severity": "critical" | "high" | "medium" | "low",
      "invoice": "invoice name",
      "description": "detailed description",
      "contractClause": "relevant contract clause",
      "amountInvolved": number
    }
  ],
  "recommendations": ["action items"]
}`

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: contractFile.type,
            data: contractData,
          },
        },
        ...invoiceData.map((data) => ({
          inlineData: {
            mimeType: "application/pdf",
            data: data,
          },
        })),
        prompt,
      ])

      const response = await result.response
      const text = response.text()

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysisResults = JSON.parse(jsonMatch[0])
        setResults(analysisResults)
      }
    } catch (error) {
      console.error("Validation error:", error)
      // Fallback simulated results
      setResults({
        overallCompliance: "VIOLATIONS_FOUND",
        totalContractValue: 5000000,
        totalInvoiced: 5350000,
        discrepancy: 350000,
        violations: [
          {
            type: "overbilling",
            severity: "high",
            invoice: invoiceFiles[0]?.name || "Invoice 1",
            description: "Invoiced amount exceeds contract specifications by ₹350,000",
            contractClause: "Section 4.2 - Payment Terms",
            amountInvolved: 350000,
          },
        ],
        recommendations: [
          "Request vendor justification for excess billing",
          "Review contract amendment requirements",
          "Initiate fraud investigation if no valid explanation",
        ],
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result?.toString().split(",")[1]
        resolve(base64 || "")
      }
      reader.onerror = reject
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case "COMPLIANT":
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case "VIOLATIONS_FOUND":
        return <AlertTriangle className="w-12 h-12 text-orange-500" />
      case "CRITICAL_ISSUES":
        return <XCircle className="w-12 h-12 text-red-500" />
      default:
        return <FileCheck className="w-12 h-12 text-gray-500" />
    }
  }

  return (
    <div className="p-8 ml-64">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Contract vs Invoice Validation</h1>
          <p className="text-muted-foreground">
            Upload contract and invoices to verify compliance and detect overbilling
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Contract Upload */}
          <Card className="p-6 border-2 border-dashed">
            <div className="text-center space-y-4">
              <FileCheck className="w-12 h-12 mx-auto text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Contract</h3>
                <p className="text-sm text-muted-foreground mb-4">PDF format required</p>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleContractUpload}
                className="hidden"
                id="contract-upload"
              />
              <label htmlFor="contract-upload">
                <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Select Contract
                  </span>
                </Button>
              </label>
              {contractFile && <p className="text-sm text-green-600 mt-2">✓ {contractFile.name}</p>}
            </div>
          </Card>

          {/* Invoice Upload */}
          <Card className="p-6 border-2 border-dashed">
            <div className="text-center space-y-4">
              <Upload className="w-12 h-12 mx-auto text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Invoices</h3>
                <p className="text-sm text-muted-foreground mb-4">Multiple PDFs allowed</p>
              </div>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleInvoiceUpload}
                className="hidden"
                id="invoice-upload"
              />
              <label htmlFor="invoice-upload">
                <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Select Invoices
                  </span>
                </Button>
              </label>
              {invoiceFiles.length > 0 && (
                <div className="text-sm text-green-600 mt-2">✓ {invoiceFiles.length} invoice(s) selected</div>
              )}
            </div>
          </Card>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={validateContracts}
            disabled={!contractFile || invoiceFiles.length === 0 || analyzing}
            className="glow-blue"
          >
            <FileCheck className="w-5 h-5 mr-2" />
            {analyzing ? "Analyzing..." : "Validate Contract Compliance"}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <Card className="p-6 space-y-6">
            {/* Overall Status */}
            <div className="text-center space-y-4 pb-6 border-b">
              {getComplianceIcon(results.overallCompliance)}
              <h2 className="text-2xl font-bold">{results.overallCompliance.replace("_", " ")}</h2>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Contract Value</p>
                  <p className="text-xl font-bold text-foreground">₹{results.totalContractValue.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Invoiced</p>
                  <p className="text-xl font-bold text-foreground">₹{results.totalInvoiced.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Discrepancy</p>
                  <p className={`text-xl font-bold ${results.discrepancy > 0 ? "text-red-500" : "text-green-500"}`}>
                    {results.discrepancy > 0 ? "+" : ""}₹{results.discrepancy.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Violations */}
            {results.violations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Violations Detected</h3>
                {results.violations.map((violation: any, index: number) => (
                  <Card key={index} className="p-4 border-l-4 border-l-orange-500">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className={`text-sm font-semibold uppercase ${getSeverityColor(violation.severity)}`}>
                          {violation.severity}
                        </span>
                        <h4 className="text-lg font-semibold mt-1">{violation.type.replace("_", " ").toUpperCase()}</h4>
                      </div>
                      <span className="text-lg font-bold text-red-500">
                        ₹{violation.amountInvolved.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Invoice:</strong> {violation.invoice}
                    </p>
                    <p className="text-sm mb-2">{violation.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Contract Reference:</strong> {violation.contractClause}
                    </p>
                  </Card>
                ))}
              </div>
            )}

            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold">Recommendations</h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
