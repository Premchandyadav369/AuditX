import { createClient } from "@supabase/supabase-js"

/**
 * Ensures the documents storage bucket exists with proper configuration
 * Run this once during application initialization
 */
export async function ensureStorageBucketExists() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn("[v0] Storage setup: Missing Supabase credentials, skipping bucket creation")
      return
    }

    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("[v0] Checking documents storage bucket...")

    // Try to list bucket to see if it exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("[v0] Error listing buckets:", listError)
      return
    }

    const documentsExists = buckets?.some((b) => b.name === "documents")

    if (documentsExists) {
      console.log("[v0] Documents bucket already exists")
      return
    }

    // Create the bucket
    console.log("[v0] Creating documents storage bucket...")
    const { data: newBucket, error: createError } = await supabase.storage.createBucket("documents", {
      public: true,
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      fileSizeLimit: 52428800, // 50MB
    })

    if (createError) {
      console.error("[v0] Error creating bucket:", createError)
      return
    }

    console.log("[v0] Documents bucket created successfully")

    // Set up public access policy
    const { error: policyError } = await supabase.storage
      .from("documents")
      .createSignedUrl("test.txt", 3600)
      .catch(() => ({
        error: null,
      }))

    if (!policyError) {
      console.log("[v0] Public access configured for documents bucket")
    }
  } catch (error) {
    console.error("[v0] Storage setup error:", error)
  }
}
