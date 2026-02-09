import { groq } from "@ai-sdk/groq"

// Groq model configuration for AuditX
const genAI = groq("mixtral-8x7b-32768")

export default genAI
export { genAI }
