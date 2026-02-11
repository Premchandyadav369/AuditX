"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Upload,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Eye,
  Download,
  Search,
} from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface ExtractedData {
  documentType: string
  vendor: {
    name: string
    address?: string
    taxId?: string
    contactInfo?: string
  }
  financial: {
    totalAmount: number
    currency: string
    taxAmount?: number
    subtotal?: number
    paymentTerms?: string
  }
  documentDetails: {
    documentNumber: string
    date: string
    dueDate?: string
    referenceNumber?: string
  }
  lineItems?: Array<{
    description: string
    quantity?: number
    unitPrice?: number
    amount: number
  }>
  parties: {
    buyer?: string
    seller?: string
    shippingAddress?: string
  }
  fraudIndicators: {
    duplicateRisk: boolean
    priceAnomalyRisk: boolean
    vendorRisk: boolean
    missingFieldsRisk: boolean
    riskScore: number
    riskReasons: string[]
  }
  confidence: number
}

interface UploadedFile {
  id: string
  name: string
  type: string
  size: string
  status: "uploading" | "processing" | "completed" | "error"
  file: File
  extractedData?: ExtractedData
  fraudScore?: number
  errorMessage?: string
  duplicateCheck?: {
    isDuplicate: boolean
    matches: any[]
    confidence: number
  }
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        console.log("[v0] User authenticated:", user.id)
      } else {
        console.error("[v0] No authenticated user found")
      }
    }
    getUser()
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = async (newFiles: File[]) => {
    if (!userId) {
      console.error("[v0] Cannot process files: User not authenticated")
      alert("Please log in to upload documents")
      return
    }

    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      status: "uploading" as const,
      file,
    }))

    setFiles((prev) => [...prev, ...uploadedFiles])

    for (const uploadedFile of uploadedFiles) {
      try {
        setFiles((prev) => prev.map((f) => (f.id === uploadedFile.id ? { ...f, status: "processing" } : f)))

        const formData = new FormData()
        uploadedFile.file && formData.append("file", uploadedFile.file)

        console.log("[v0] Sending document to OCR.space + Gemini API:", uploadedFile.name)

        const response = await fetch("/api/ocr/extract", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Analysis failed: ${response.statusText}`)
        }

        const result = await response.json()
        console.log("[v0] OCR + Gemini analysis successful:", result.data)

        // Safely extract data with fallbacks
        const documentNumber = result.data?.documentDetails?.documentNumber || `DOC-${Date.now()}`
        const vendorName = result.data?.vendor?.name || "Unknown Vendor"
        const amount = result.data?.financial?.totalAmount || 0
        const documentType = result.data?.documentType || "unknown"

        const duplicateResponse = await fetch("/api/ocr/duplicate-detection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentNumber,
            vendorName,
            amount,
            documentType,
          }),
        })

        const duplicateCheck = await duplicateResponse.json()
        console.log("[v0] Duplicate check result:", duplicateCheck)

        // Try to upload file to storage, but if bucket doesn't exist, continue with database storage
        const fileExt = uploadedFile.name.split(".").pop()
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        let publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${fileName}`

        console.log("[v0] Attempting to upload file to storage:", fileName)

        // Try uploading to storage (may fail if bucket doesn't exist)
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(fileName, uploadedFile.file, {
            cacheControl: "3600",
            upsert: true,
          })

        if (uploadError) {
          console.warn("[v0] Storage upload failed (continuing without storage):", uploadError.message)
          // Use fallback URL format - file won't be in storage but metadata will be saved
          publicUrl = `storage://metadata/${Date.now()}`
        } else {
          console.log("[v0] File uploaded successfully to storage:", fileName)
          const { data: urlData } = supabase.storage.from("documents").getPublicUrl(fileName)
          if (urlData?.publicUrl) {
            publicUrl = urlData.publicUrl
          }
        }

        // Safely determine fiscal year
        const docDate = result.data?.documentDetails?.date || new Date().toISOString()
        const fiscalYear = new Date(docDate).getFullYear()

        const { data: savedDoc, error: dbError } = await supabase
          .from("documents")
          .insert({
            user_id: userId,
            file_name: uploadedFile.name,
            file_type: uploadedFile.type,
            file_size: uploadedFile.file.size,
            file_url: publicUrl,
            status: "completed",
            processed_date: new Date().toISOString(),
            extracted_data: result.data,
            department: result.data?.parties?.buyer || "General",
            fiscal_year: fiscalYear,
          })
          .select()
          .single()

        if (dbError) {
          console.error("[v0] Database save error:", dbError)
          throw new Error(`Database error: ${dbError.message}`)
        } else {
          console.log("[v0] Document saved to database with ID:", savedDoc.id)
        }

        const vendorNameToCheck = result.data?.vendor?.name || ""
        
        const { data: existingVendor } = vendorNameToCheck
          ? await supabase
              .from("vendors")
              .select("id")
              .eq("name", vendorNameToCheck)
              .single()
          : { data: null }

        let vendorId = existingVendor?.id

        if (!vendorId && vendorNameToCheck) {
          const { data: newVendor, error: vendorError } = await supabase
            .from("vendors")
            .insert({
              name: vendorNameToCheck,
              tax_id: result.data?.vendor?.taxId || "",
              address: result.data?.vendor?.address || "",
              contact_email: result.data?.vendor?.contactInfo || "",
              category: result.data?.documentType || "unknown",
              risk_score: result.data?.fraudIndicators?.riskScore || 0,
            })
            .select()
            .single()

          if (!vendorError && newVendor) {
            vendorId = newVendor.id
            console.log("[v0] Created new vendor:", vendorId)
          }
        }

        const { data: transaction, error: txError } = await supabase
          .from("transactions")
          .insert({
            document_id: savedDoc.id,
            user_id: userId,
            transaction_date: result.data.documentDetails.date,
            amount: result.data.financial.totalAmount,
            vendor_id: vendorId,
            department: result.data.parties?.buyer || "General",
            category: result.data.documentType,
            description: `${result.data.documentType} - ${result.data.documentDetails.documentNumber}`,
            payment_method: result.data.financial.paymentTerms || "Unknown",
            invoice_number: result.data.documentDetails.documentNumber,
            status: result.data.fraudIndicators.riskScore > 70 ? "flagged" : "approved",
            risk_score: result.data.fraudIndicators.riskScore,
            is_flagged: result.data.fraudIndicators.riskScore > 70,
          })
          .select()
          .single()

        if (txError) {
          console.error("[v0] Transaction save error:", txError)
        } else {
          console.log("[v0] Transaction created:", transaction.id)
        }

        if (result.data.fraudIndicators.riskScore > 70) {
          await supabase.from("alerts").insert({
            user_id: userId,
            alert_type: "fraud_detection",
            severity: result.data.fraudIndicators.riskScore > 85 ? "critical" : "high",
            title: "High Risk Document Detected",
            message: `Document ${result.data.documentDetails.documentNumber} from ${result.data.vendor.name} flagged with ${result.data.fraudIndicators.riskScore}% risk score`,
            related_entity_type: "document",
            related_entity_id: savedDoc.id,
            action_url: `/dashboard/fraud`,
            metadata: {
              riskReasons: result.data.fraudIndicators.riskReasons,
              documentNumber: result.data.documentDetails.documentNumber,
              vendor: result.data.vendor.name,
              amount: result.data.financial.totalAmount,
            },
          })
          console.log("[v0] High-risk alert created")
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id
              ? {
                  ...f,
                  status: "completed",
                  extractedData: result.data,
                  fraudScore: result.data.fraudIndicators.riskScore,
                  duplicateCheck,
                }
              : f,
          ),
        )
      } catch (error) {
        console.error("[v0] Document processing error:", error)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id
              ? {
                  ...f,
                  status: "error",
                  errorMessage: error instanceof Error ? error.message : "Processing failed",
                }
              : f,
          ),
        )
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return ImageIcon
    if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet
    return FileText
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Document Intelligence</h1>
          <p className="text-muted-foreground">
            Advanced OCR with GPT-4 Vision • Fraud Detection • Duplicate Prevention
          </p>
        </div>

        <Card className="p-8 mb-8 bg-card/50 backdrop-blur-sm border-border/50">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? "border-primary bg-primary/5 glow-blue"
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-xl holographic-gradient flex items-center justify-center glow-blue">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Drop files for AI analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Supports PDF, JPG, PNG, XLSX • Max 10MB • Powered by Groq
                </p>
              </div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                onChange={handleFileInput}
              />
              <label htmlFor="file-upload">
                <Button className="holographic-gradient glow-blue" asChild>
                  <span>Select Files</span>
                </Button>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium text-foreground">Invoice</div>
                <div className="text-xs text-muted-foreground">AI Extraction</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <Search className="w-5 h-5 text-secondary" />
              <div>
                <div className="text-sm font-medium text-foreground">Duplicate Check</div>
                <div className="text-xs text-muted-foreground">Instant</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <AlertCircle className="w-5 h-5 text-accent" />
              <div>
                <div className="text-sm font-medium text-foreground">Fraud Detection</div>
                <div className="text-xs text-muted-foreground">Real-time</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <FileSpreadsheet className="w-5 h-5 text-chart-4" />
              <div>
                <div className="text-sm font-medium text-foreground">Data Export</div>
                <div className="text-xs text-muted-foreground">JSON/CSV</div>
              </div>
            </div>
          </div>
        </Card>

        {files.length > 0 && (
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Processing Queue</h3>
            <div className="space-y-4">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.type)
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-background/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileIcon className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({file.size})</span>
                      </div>

                      {file.status === "uploading" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      )}

                      {file.status === "processing" && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>AI analyzing document with Groq...</span>
                        </div>
                      )}

                      {file.status === "completed" && file.extractedData && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm flex-wrap">
                            <div className="flex items-center gap-2 text-chart-4">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Processed</span>
                            </div>
                            <span className="text-muted-foreground">Vendor: {file.extractedData.vendor.name}</span>
                            <span className="text-muted-foreground">
                              Amount: {file.extractedData.financial.currency}{" "}
                              {file.extractedData.financial.totalAmount.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">
                              Doc: {file.extractedData.documentDetails.documentNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                file.fraudScore && file.fraudScore > 70
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-chart-4/10 text-chart-4"
                              }`}
                            >
                              Risk: {file.fraudScore}%
                            </span>
                            {file.duplicateCheck?.isDuplicate && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-destructive/10 text-destructive">
                                Duplicate Detected!
                              </span>
                            )}
                          </div>
                          {file.extractedData.fraudIndicators.riskReasons.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Risks: {file.extractedData.fraudIndicators.riskReasons.join(", ")}
                            </div>
                          )}
                        </div>
                      )}

                      {file.status === "error" && (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <AlertCircle className="w-4 h-4" />
                          <span>{file.errorMessage || "Processing failed"}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status === "completed" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedFile(file)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Download Data">
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => removeFile(file.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {selectedFile && selectedFile.extractedData && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFile(null)}
          >
            <Card
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-card border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Document Analysis Results</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Vendor Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <span className="ml-2 text-foreground font-medium">
                          {selectedFile.extractedData.vendor.name}
                        </span>
                      </div>
                      {selectedFile.extractedData.vendor.address && (
                        <div>
                          <span className="text-muted-foreground">Address:</span>
                          <span className="ml-2 text-foreground">{selectedFile.extractedData.vendor.address}</span>
                        </div>
                      )}
                      {selectedFile.extractedData.vendor.taxId && (
                        <div>
                          <span className="text-muted-foreground">Tax ID:</span>
                          <span className="ml-2 text-foreground">{selectedFile.extractedData.vendor.taxId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Financial Details</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Amount:</span>
                        <span className="ml-2 text-foreground font-bold text-lg">
                          {selectedFile.extractedData.financial.currency}{" "}
                          {selectedFile.extractedData.financial.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      {selectedFile.extractedData.financial.subtotal && (
                        <div>
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="ml-2 text-foreground">
                            {selectedFile.extractedData.financial.currency}{" "}
                            {selectedFile.extractedData.financial.subtotal.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedFile.extractedData.financial.taxAmount && (
                        <div>
                          <span className="text-muted-foreground">Tax:</span>
                          <span className="ml-2 text-foreground">
                            {selectedFile.extractedData.financial.currency}{" "}
                            {selectedFile.extractedData.financial.taxAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Document Details</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Document Type:</span>
                        <span className="ml-2 text-foreground capitalize">
                          {selectedFile.extractedData.documentType}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Document Number:</span>
                        <span className="ml-2 text-foreground font-mono">
                          {selectedFile.extractedData.documentDetails.documentNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <span className="ml-2 text-foreground">{selectedFile.extractedData.documentDetails.date}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="ml-2 text-foreground font-semibold">
                          {selectedFile.extractedData.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Fraud Risk Analysis</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <span className="text-muted-foreground">Risk Score:</span>
                        <span
                          className={`px-3 py-1 rounded-full font-bold ${
                            selectedFile.fraudScore && selectedFile.fraudScore > 70
                              ? "bg-destructive/20 text-destructive"
                              : selectedFile.fraudScore && selectedFile.fraudScore > 40
                                ? "bg-chart-2/20 text-chart-2"
                                : "bg-chart-4/20 text-chart-4"
                          }`}
                        >
                          {selectedFile.fraudScore}%
                        </span>
                      </div>
                      <div className="space-y-1">
                        {selectedFile.extractedData.fraudIndicators.duplicateRisk && (
                          <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            <span>Duplicate Risk Detected</span>
                          </div>
                        )}
                        {selectedFile.extractedData.fraudIndicators.priceAnomalyRisk && (
                          <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            <span>Price Anomaly Detected</span>
                          </div>
                        )}
                        {selectedFile.extractedData.fraudIndicators.vendorRisk && (
                          <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            <span>Vendor Risk Flag</span>
                          </div>
                        )}
                        {selectedFile.extractedData.fraudIndicators.missingFieldsRisk && (
                          <div className="flex items-center gap-2 text-chart-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>Missing Required Fields</span>
                          </div>
                        )}
                      </div>
                      {selectedFile.extractedData.fraudIndicators.riskReasons.length > 0 && (
                        <div className="mt-3 p-3 bg-destructive/5 rounded-lg">
                          <div className="font-medium text-foreground mb-2">Risk Reasons:</div>
                          <ul className="space-y-1 text-muted-foreground">
                            {selectedFile.extractedData.fraudIndicators.riskReasons.map((reason, idx) => (
                              <li key={idx} className="text-xs">
                                • {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedFile.extractedData.lineItems && selectedFile.extractedData.lineItems.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Line Items</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-muted-foreground font-medium">Description</th>
                            <th className="text-right py-2 text-muted-foreground font-medium">Quantity</th>
                            <th className="text-right py-2 text-muted-foreground font-medium">Unit Price</th>
                            <th className="text-right py-2 text-muted-foreground font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedFile.extractedData.lineItems.map((item, idx) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="py-2 text-foreground">{item.description}</td>
                              <td className="py-2 text-right text-foreground">{item.quantity || "-"}</td>
                              <td className="py-2 text-right text-foreground">
                                {item.unitPrice
                                  ? `${selectedFile.extractedData?.financial.currency} ${item.unitPrice.toLocaleString()}`
                                  : "-"}
                              </td>
                              <td className="py-2 text-right text-foreground font-medium">
                                {selectedFile.extractedData?.financial.currency} {item.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
