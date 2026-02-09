export function simulateOCR(fileName: string, fileType: string) {
  const vendors = [
    "Tata Consultancy Services",
    "Infosys Ltd",
    "Wipro Technologies",
    "HCL Technologies",
    "Tech Mahindra",
  ]
  const vendorName = vendors[Math.floor(Math.random() * vendors.length)]
  const baseAmount = Math.floor(Math.random() * 900000) + 100000

  return {
    fileName,
    vendorName,
    totalAmount: baseAmount,
    date: new Date().toISOString().split("T")[0],
    extractedText: `Simulated content for ${fileName}. This is a ${fileType} document from ${vendorName} for the amount of ₹${baseAmount}.`
  }
}
