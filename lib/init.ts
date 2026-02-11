/**
 * Application initialization - runs once on first load
 */
let initialized = false

export async function initializeApp() {
  if (initialized) {
    return
  }

  try {
    console.log("[v0] Initializing AuditX application...")

    // Ensure Supabase storage bucket exists
    if (typeof window === "undefined") {
      // Server-side only
      const { ensureStorageBucketExists } = await import("@/lib/supabase/setup-storage")
      await ensureStorageBucketExists()
    }

    console.log("[v0] Application initialization complete")
    initialized = true
  } catch (error) {
    console.error("[v0] Initialization error:", error)
    // Don't throw - allow app to continue
    initialized = true
  }
}
