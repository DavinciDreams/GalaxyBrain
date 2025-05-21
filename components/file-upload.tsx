"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from "@/app/actions/blob-actions"
import { FileIcon, ImageIcon, FileAudioIcon, FileTextIcon, FileVideoIcon, XIcon } from "lucide-react"

interface FileUploadProps {
  onUploadComplete: (fileData: {
    url: string
    filename: string
    contentType: string
    size: number
  }) => void
  accept?: string
  maxSize?: number // in MB
}

export function FileUpload({ onUploadComplete, accept, maxSize = 50 }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFile = async (file: File) => {
    // Check file size
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadFile(formData)

      clearInterval(progressInterval)

      if (result.success) {
        setProgress(100)
        setTimeout(() => {
          setIsUploading(false)
          setProgress(0)
          onUploadComplete({
            url: result.url,
            filename: result.filename,
            contentType: result.contentType,
            size: result.size,
          })
        }, 500)

        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      clearInterval(progressInterval)
      setIsUploading(false)
      setProgress(0)

      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (contentType.startsWith("audio/")) return <FileAudioIcon className="h-4 w-4" />
    if (contentType.startsWith("video/")) return <FileVideoIcon className="h-4 w-4" />
    if (contentType.includes("pdf") || contentType.includes("text")) return <FileTextIcon className="h-4 w-4" />
    return <FileIcon className="h-4 w-4" />
  }

  return (
    <div>
      {isUploading ? (
        <div className="rounded-lg border border-dashed p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Uploading...</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsUploading(false)}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
      ) : (
        <div
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          </div>
          <p className="mt-2 text-sm font-medium">Drag and drop a file or click to browse</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {accept ? `Supported formats: ${accept.replace(/\./g, "").toUpperCase()}` : "All file types supported"}{" "}
            (Max: {maxSize}MB)
          </p>
          <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={handleChange} />
        </div>
      )}
    </div>
  )
}
