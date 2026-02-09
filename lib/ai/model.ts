import { groq } from "@ai-sdk/groq"

// Groq model configuration for AuditX
// Using llama-3.3-70b-versatile for high quality or mixtral-8x7b-32768
export const model = groq("mixtral-8x7b-32768")

// Fast inference model for real-time operations
export const fastModel = groq("llama-3.1-8b-instant")

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
