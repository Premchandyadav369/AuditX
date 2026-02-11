import { createServerClient } from "@/lib/supabase/server"

/**
 * Creates the documents storage bucket if it doesn't exist
 * Call this during app initialization or manual setup
 */
export async function createStorageBucket() {
  try {
    const supabase = await createServerClient()

    console.log("[v0] Checking if documents bucket exists...")

    // Try to list files in the bucket to check if it exists
    const { data: existingBucket, error: checkError } = await supabase.storage
      .from("documents")
      .list("", { limit: 1 })

    if (existingBucket) {
      console.log("[v0] Documents bucket already exists")
      return { success: true, message: "Bucket already exists" }
    }

    // If bucket doesn't exist, we need to create it via Admin API
    if (checkError?.message?.includes("not found")) {
      console.log("[v0] Documents bucket not found, creating via API...")

      // Use admin API to create bucket
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/b`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            name: "documents",
            id: "documents",
            public: true,
            file_size_limit: 52428800, // 50MB
            allowed_mime_types: [
              "application/pdf",
              "image/jpeg",
              "image/png",
              "image/webp",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "text/plain",
            ],
          }),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] Failed to create bucket:", error)

        // If bucket already exists, that's fine
        if (error.message?.includes("already exists")) {
          console.log("[v0] Bucket already exists (confirmed)")
          return { success: true, message: "Bucket already exists" }
        }

        return { success: false, message: error.message }
      }

      const bucket = await response.json()
      console.log("[v0] Documents bucket created successfully:", bucket.name)
      return { success: true, message: "Bucket created successfully", bucket }
    }

    return { success: false, message: checkError?.message }
  } catch (error) {
    console.error("[v0] Error creating storage bucket:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Simplified fallback storage option - store file metadata in database instead
 */
export async function saveDocumentMetadata(
  userId: string,
  fileName: string,
  extractedData: any,
  fileSize: number,
) {
  try {
    const supabase = await createServerClient()

    console.log("[v0] Saving document metadata to database...")

    const { data, error } = await supabase.from("documents").insert({
      user_id: userId,
      file_name: fileName,
      file_type: extractedData?.documentType || "unknown",
      file_size: fileSize,
      file_url: `storage://${fileName}`, // Placeholder for storage URL
      status: "completed",
      processed_date: new Date().toISOString(),
      extracted_data: extractedData,
      department: extractedData?.parties?.buyer || "General",
      fiscal_year: new Date(extractedData?.documentDetails?.date || new Date()).getFullYear(),
    })

    if (error) {
      console.error("[v0] Error saving metadata:", error)
      return { success: false, error }
    }

    console.log("[v0] Document metadata saved successfully")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error in saveDocumentMetadata:", error)
    return { success: false, error }
  }
}
