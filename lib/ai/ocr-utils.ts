export async function performOCR(file: File) {
  const engine = process.env.OCR_ENGINE || "ocr-space"

  console.log(`Performing OCR using engine: ${engine} for file: ${file.name}`)

  try {
    if (engine === "ocr-space") {
      return await performOCRSpace(file)
    } else if (engine === "sarvam") {
      return await performSarvamOCR(file)
    } else {
      return await performOCRSpace(file)
    }
  } catch (error) {
    console.error("Primary OCR Error, trying fallback:", error)
    try {
      // Fallback to OCR Space if it wasn't the primary
      if (engine !== "ocr-space") {
        return await performOCRSpace(file)
      }
      throw error
    } catch (fallbackError) {
      console.error("OCR Fallback Error:", fallbackError)
      // Return a simulated result if everything fails, to allow the UI to function
      return {
        fileName: file.name,
        extractedText: `[OCR Failed] This is a simulated extraction for ${file.name} because the OCR service was unavailable.`,
        error: true,
        vendorName: "Unknown",
        totalAmount: 0,
        date: new Date().toISOString().split("T")[0],
      }
    }
  }
}

async function performOCRSpace(file: File) {
  const apiKey = process.env.OCR_SPACE_API_KEY
  if (!apiKey) {
    console.warn("OCR_SPACE_API_KEY not found in environment variables. Falling back to default.")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("apikey", apiKey || "K8924895668895")
  formData.append("language", "eng")
  formData.append("isTable", "true")
  formData.append("scale", "true")
  formData.append("isOverlayRequired", "false")

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`OCR.space API error: ${response.statusText}`)
  }

  const result = await response.json()

  if (result.IsErroredOnProcessing) {
    throw new Error(`OCR processing error: ${result.ErrorMessage.join(", ")}`)
  }

  const extractedText = result.ParsedResults?.map((res: any) => res.ParsedText).join("\n") || ""

  return {
    fileName: file.name,
    extractedText,
    rawResult: result,
    vendorName: "Detected from OCR",
    totalAmount: 0,
    date: new Date().toISOString().split("T")[0],
  }
}

// Sarvam OCR implementation
async function performSarvamOCR(file: File) {
  const apiKey = process.env.SARVAM_API_KEY
  if (!apiKey) throw new Error("SARVAM_API_KEY not configured")

  console.log("Attempting Sarvam Document Intelligence OCR...")

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("https://api.sarvam.ai/doc-intelligence/ocr", {
    method: "POST",
    headers: {
      "api-key": apiKey,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Sarvam API error (${response.status}): ${errorText}`)
  }

  const result = await response.json()

  // Sarvam's response structure usually has 'text' or 'pages'
  const extractedText = result.text || result.pages?.map((p: any) => p.text).join("\n") || ""

  return {
    fileName: file.name,
    extractedText,
    rawResult: result,
    vendorName: "Detected via Sarvam",
    totalAmount: 0,
    date: new Date().toISOString().split("T")[0],
  }
}
