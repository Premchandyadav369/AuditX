"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, Loader2, TrendingUp, AlertTriangle, Users, FileText } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  context?: any
}

const quickQueries = [
  { icon: TrendingUp, label: "Show spending trends", query: "Analyze spending trends across all departments" },
  {
    icon: AlertTriangle,
    label: "High risk vendors",
    query: "List all high risk vendors with risk scores above 70%",
  },
  { icon: Users, label: "Vendor analysis", query: "Which vendors received the most payments in the last month?" },
  {
    icon: FileText,
    label: "Fraud patterns",
    query: "Identify any duplicate invoices or suspicious transaction patterns",
  },
]

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm AuditX AI Copilot powered by Google Gemini. I can analyze your audit data, detect fraud patterns, assess vendor risks, and answer questions about transactions, compliance, and spending. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (messageText?: string) => {
    const query = messageText || input
    if (!query.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: query,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/ai/ai-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          conversationHistory,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          context: data.context,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl holographic-gradient flex items-center justify-center glow-blue">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">AI Copilot</h1>
            </div>
            <p className="text-muted-foreground">Powered by Google Gemini Pro • Real-time Data Analysis</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {quickQueries.map((query, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-accent transition-colors border-border/50"
                onClick={() => sendMessage(query.query)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <query.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">{query.label}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{query.query}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="flex flex-col h-[calc(100vh-400px)] bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground glow-blue"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    {message.context && (
                      <div className="mt-3 pt-3 border-t border-primary-foreground/20 text-xs opacity-75">
                        <div className="flex gap-4">
                          <span>📊 {message.context.transactionsAnalyzed} transactions</span>
                          <span>⚠️ {message.context.highRiskVendorsCount} high-risk vendors</span>
                          <span>🔔 {message.context.activeAlertsCount} alerts</span>
                        </div>
                      </div>
                    )}
                    <div className="text-xs opacity-50 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl p-4 bg-accent text-accent-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask about fraud patterns, vendor risks, spending trends..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button onClick={() => sendMessage()} disabled={isLoading || !input.trim()} size="icon">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
