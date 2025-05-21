"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "./file-upload"
import { Loader2Icon, CheckIcon, FileTextIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function OCRProcessor() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const { toast } = useToast()

  const handleFileUpload = async (fileData: {
    url: string
    filename: string
    contentType: string
    size: number
  }) => {
    if (!fileData.contentType.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file for OCR processing",
        variant: "destructive",
      })
      return
    }

    setImageUrl(fileData.url)
    setIsProcessing(true)

    // Simulate OCR processing
    setTimeout(() => {
      // This is where you would call an actual OCR service
      // For demo purposes, we're just simulating the result
      const simulatedText = `Galaxy Brain App
      
Project Notes - May 17, 2025

Key Features:
• Voice-first interface with natural language processing
• AI-powered note organization and summarization
• Infinite canvas with multi-touch support
• Cross-platform compatibility
• End-to-end encryption

Next Steps:
1. Finalize technology stack
2. Create prototype for voice commands
3. Test AI integration
4. Design user interface mockups`

      setExtractedText(simulatedText)
      setIsProcessing(false)

      toast({
        title: "OCR processing complete",
        description: "Text has been extracted from the image",
      })
    }, 3000)
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText)
    toast({
      title: "Copied to clipboard",
      description: "The extracted text has been copied to your clipboard",
    })
  }

  const handleCreateNote = () => {
    toast({
      title: "Note created",
      description: "A new note has been created with the extracted text",
    })
    // Reset state
    setExtractedText("")
    setImageUrl("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>OCR Text Extraction</CardTitle>
        <CardDescription>Upload an image containing text to extract its content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!imageUrl ? (
          <FileUpload onUploadComplete={handleFileUpload} accept=".jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff" maxSize={10} />
        ) : (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-md border">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Uploaded image"
                className="h-auto max-h-64 w-full object-contain"
              />
            </div>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Processing image...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Extracted Text</h3>
                </div>
                <Textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Extracted text will appear here..."
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
      {extractedText && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCopyText}>
            Copy Text
          </Button>
          <Button onClick={handleCreateNote}>
            <CheckIcon className="mr-2 h-4 w-4" />
            Create Note
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
