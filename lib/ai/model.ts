import { google } from "@ai-sdk/google"

// Google Gemini model configuration for AuditX
// Using gemini-2.0-flash for high quality analysis and real-time operations
export const model = google("gemini-2.0-flash")

// Fast inference model for real-time operations
export const fastModel = google("gemini-2.0-flash")

// Standard generation options
export const generationOptions = {
  temperature: 0.3,
  maxTokens: 2048,
}

// Creative generation options (for recommendations, narrative generation)
export const creativeOptions = {
  temperature: 0.7,
  maxTokens: 2048,
}
