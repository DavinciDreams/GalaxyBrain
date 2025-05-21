"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileIcon, ImageIcon, FileAudioIcon, FileTextIcon, FileVideoIcon, XIcon, DownloadIcon } from "lucide-react"
import { deleteFile } from "@/app/actions/blob-actions"
import { useToast } from "@/hooks/use-toast"

interface FileAttachmentProps {
  file: {
    url: string
    filename: string
    contentType: string
    size: number
  }
  onDelete?: () => void
  showPreview?: boolean
}

export function FileAttachment({ file, onDelete, showPreview = true }: FileAttachmentProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (contentType.startsWith("audio/")) return <FileAudioIcon className="h-4 w-4" />
    if (contentType.startsWith("video/")) return <FileVideoIcon className="h-4 w-4" />
    if (contentType.includes("pdf") || contentType.includes("text")) return <FileTextIcon className="h-4 w-4" />
    return <FileIcon className="h-4 w-4" />
  }

  const handleDelete = async () => {
    if (isDeleting) return

    setIsDeleting(true)
    try {
      const result = await deleteFile(file.url)

      if (result.success) {
        toast({
          title: "File deleted",
          description: `${file.filename} has been deleted`,
        })
        onDelete?.()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const renderPreview = () => {
    if (!showPreview) return null

    if (file.contentType.startsWith("image/")) {
      return (
        <div className="mt-2 overflow-hidden rounded-md border">
          <img
            src={file.url || "/placeholder.svg"}
            alt={file.filename}
            className="h-auto max-h-48 w-full object-cover"
          />
        </div>
      )
    }

    if (file.contentType.startsWith("audio/")) {
      return (
        <div className="mt-2">
          <audio controls className="w-full">
            <source src={file.url} type={file.contentType} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )
    }

    if (file.contentType.startsWith("video/")) {
      return (
        <div className="mt-2 overflow-hidden rounded-md border">
          <video controls className="h-auto max-h-48 w-full">
            <source src={file.url} type={file.contentType} />
            Your browser does not support the video element.
          </video>
        </div>
      )
    }

    return null
  }

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">{getFileIcon(file.contentType)}</div>
          <div>
            <h4 className="font-medium">{file.filename}</h4>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)} • {file.contentType.split("/")[1].toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={file.url} download={file.filename} target="_blank" rel="noopener noreferrer">
              <DownloadIcon className="h-4 w-4" />
            </a>
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {renderPreview()}
    </div>
  )
}
