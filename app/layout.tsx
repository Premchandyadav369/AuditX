import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

// Using Inter font for clean, modern look suitable for government platform
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "AuditX - AI-Powered Fraud Detection for Public Expenditure",
  description:
    "Every transaction audited. Every rupee protected. AuditX autonomously analyzes financial documents, detects anomalies, enforces compliance, and prevents fraud using Google Gemini AI.",
  generator: "v0.app",
  icons: {
    icon: "/auditx-logo.jpeg",
    apple: "/auditx-logo.jpeg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
