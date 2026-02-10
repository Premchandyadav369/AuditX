export async function performOCR(file: File) {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("apikey", process.env.OCR_SPACE_API_KEY || "")
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

    // Try to find some basic info from the text if possible, but the AI will do the heavy lifting
    // For compatibility with the old simulateOCR return type if needed
    return {
      fileName: file.name,
      extractedText,
      rawResult: result,
      // We'll let the AI determine these, but providing defaults
      vendorName: "Detected from OCR",
      totalAmount: 0,
      date: new Date().toISOString().split("T")[0],
    }
  } catch (error) {
    console.error("OCR Error:", error)
    throw error
  }
}
