import { OCRProcessor } from "@/components/ocr-processor"

export default function OCRPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">OCR Text Extraction</h1>
      <div className="max-w-3xl">
        <OCRProcessor />
      </div>
    </div>
  )
}
