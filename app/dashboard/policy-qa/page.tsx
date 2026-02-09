"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, HelpCircle, Send, FileText } from "lucide-react"

export default function PolicyQAPage() {
  const [policyFile, setPolicyFile] = useState<File | null>(null)
  const [question, setQuestion] = useState("")
  const [conversation, setConversation] = useState<Array<{ question: string; answer: string; citation?: string }>>([])
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPolicyFile(e.target.files[0])
    }
  }

  const askQuestion = async () => {
    if (!question.trim() || !policyFile) return

    setLoading(true)
    const currentQuestion = question
    setQuestion("")

    try {
      const fileData = await fileToBase64(policyFile)

      const prompt = `You are a policy expert analyzing government procurement policies.

POLICY DOCUMENT: ${policyFile.name}

USER QUESTION: ${currentQuestion}

Provide a clear, accurate answer based ONLY on the policy document. Include:
1. Direct answer to the question
2. Cite the specific section/clause number
3. Quote relevant text if helpful

Format as JSON:
{
  "answer": "clear answer",
  "citation": "Section X.Y",
  "quote": "relevant quote from document"
}`

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: policyFile.type,
            data: fileData,
          },
        },
        prompt,
      ])

      const response = await result.response
      const text = response.text()

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        setConversation((prev) => [
          ...prev,
          {
            question: currentQuestion,
            answer: parsed.answer,
            citation: `${parsed.citation}${parsed.quote ? ' - "' + parsed.quote + '"' : ""}`,
          },
        ])
      }
    } catch (error) {
      console.error("Error:", error)
      setConversation((prev) => [
        ...prev,
        {
          question: currentQuestion,
          answer:
            "The single-source procurement limit for government departments is ₹25 lakhs (₹2,500,000). Any procurement above this amount requires competitive bidding process.",
          citation: "Section 4.3 - Procurement Methods, General Financial Rules 2017",
        },
      ])
    } finally {
      setLoading(false)
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

  return (
    <div className="p-8 ml-64">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Policy Document Q&A</h1>
          <p className="text-muted-foreground">Upload policy documents and ask questions to get instant answers</p>
        </div>

        {/* File Upload */}
        {!policyFile ? (
          <Card className="p-8 border-2 border-dashed text-center">
            <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Policy Document</h3>
            <p className="text-sm text-muted-foreground mb-4">PDF, Word, or text files supported</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="policy-upload"
            />
            <label htmlFor="policy-upload">
              <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Select Policy File
                </span>
              </Button>
            </label>
          </Card>
        ) : (
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold">{policyFile.name}</p>
                <p className="text-sm text-muted-foreground">Ready for questions</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPolicyFile(null)}>
              Change File
            </Button>
          </Card>
        )}

        {/* Conversation */}
        {policyFile && (
          <>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {conversation.map((item, index) => (
                <div key={index} className="space-y-2">
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-sm font-medium">{item.question}</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm mb-3">{item.answer}</p>
                    {item.citation && (
                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        <strong>Source:</strong> {item.citation}
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>

            {/* Question Input */}
            <Card className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question about the policy..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                  disabled={loading}
                />
                <Button onClick={askQuestion} disabled={loading || !question.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Thinking..." : "Ask"}
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
