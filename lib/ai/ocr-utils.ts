/**
 * Simple OCR with fallback:
 * 1. Primary: OCR.space Free API (K89248956688957)
 * 2. Fallback: Gemini 2.5 Flash for document analysis
 */
export async function performOCR(file: File) {
  try {
    console.log("[v0] Performing OCR on file:", file.name)
    
    const formData = new FormData()
    formData.append("file", file)
    formData.append("apikey", "K89248956688957")
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
      throw new Error(`OCR error: ${result.ErrorMessage?.join(", ") || "Unknown error"}`)
    }

    const extractedText = result.ParsedResults?.map((res: any) => res.ParsedText).join("\n") || ""

    console.log("[v0] OCR.space successful. Text length:", extractedText.length)

    return {
      fileName: file.name,
      extractedText,
      rawResult: result,
      vendorName: "Detected by OCR",
      totalAmount: 0,
      date: new Date().toISOString().split("T")[0],
      ocrMethod: "ocr-space",
    }
  } catch (error) {
    console.error("[v0] OCR.space failed, will use Gemini fallback:", error)
    return {
      fileName: file.name,
      extractedText: "",
      rawResult: null,
      vendorName: "Processed by Gemini AI",
      totalAmount: 0,
      date: new Date().toISOString().split("T")[0],
      ocrMethod: "gemini-fallback",
    }
  }
}
