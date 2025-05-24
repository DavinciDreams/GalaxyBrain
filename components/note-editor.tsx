"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FileAttachment } from "./file-attachment"
import { FileUpload } from "./file-upload"
import { NoteVoiceTranscription } from "./note-voice-transcription"
import { useToast } from "@/hooks/use-toast"
import { PaperclipIcon, MicIcon, Loader2Icon } from "lucide-react"

interface Attachment {
  url: string
  filename: string
  contentType: string
  size: number
}

export function NoteEditor({ noteId }: { noteId: string }) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchNote() {
      try {
        const response = await fetch(`/api/notes/${noteId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch note")
        }
        const data = await response.json()
        setContent(data.content)
        setAttachments(data.attachments)
      } catch (error) {
        console.error("Error fetching note:", error)
        toast({
          title: "Error",
          description: "Failed to load note content",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (noteId) {
      fetchNote()
    }
  }, [noteId, toast])

  const handleSave = async () => {
    if (isSaving) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          attachments,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save note")
      }

      toast({
        title: "Saved",
        description: "Your note has been saved",
      })
    } catch (error) {
      console.error("Error saving note:", error)
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAttachmentDelete = async (url: string) => {
    try {
      const response = await fetch(`/api/attachments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete attachment")
      }

      setAttachments((prev) => prev.filter((a) => a.url !== url))
    } catch (error) {
      console.error("Error deleting attachment:", error)
      toast({
        title: "Error",
        description: "Failed to delete attachment",
        variant: "destructive",
      })
    }
  }

  const handleFileUploadComplete = (fileData: {
    url: string
    filename: string
    contentType: string
    size: number
  }) => {
    setAttachments((prev) => [...prev, fileData])
    setShowFileUpload(false)
  }

  const handleVoiceRecordingComplete = (recordingData: {
    url: string
    filename: string
    contentType: string
    duration: string
  }) => {
    setAttachments((prev) => [
      ...prev,
      {
        url: recordingData.url,
        filename: `Voice Recording (${recordingData.duration})`,
        contentType: recordingData.contentType,
        size: 0, // Size unknown at this point
      },
    ])
    setShowVoiceRecorder(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col p-4">
      <Tabs defaultValue="edit" className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="attachments">Attachments ({attachments.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="flex-1 overflow-auto">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[calc(100vh-300px)] resize-none border-0 p-4 text-base focus-visible:ring-0"
            placeholder="Start typing or use voice commands..."
          />
        </TabsContent>
        <TabsContent value="preview" className="flex-1 overflow-auto p-4">
          <div className="prose max-w-none dark:prose-invert">
            <h1>Project Brainstorming</h1>
            <h2>Voice-First Interface</h2>
            <ul>
              <li>Implement high-accuracy speech-to-text</li>
              <li>Enable voice commands for all app functions</li>
              <li>Support natural language processing</li>
              <li>Include AI-powered text-to-speech</li>
            </ul>
            <h2>AI Integration</h2>
            <ul>
              <li>Automatic note summarization</li>
              <li>Smart content suggestions</li>
              <li>Context-aware organization</li>
              <li>Real-time translation</li>
            </ul>
            <h2>Canvas Features</h2>
            <ul>
              <li>Infinite scrolling canvas</li>
              <li>Support for stylus input</li>
              <li>Multi-touch gestures</li>
              <li>Handwriting recognition</li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="canvas" className="flex-1 overflow-hidden">
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
            <div>
              <h3 className="text-lg font-medium">Canvas View</h3>
              <p className="text-sm text-muted-foreground">
                The canvas view allows for freeform drawing, diagramming, and spatial organization of your notes.
              </p>
              <Button className="mt-4">Open in Canvas Editor</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="attachments" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {attachments.length > 0 ? (
              attachments.map((attachment, index) => (
                <FileAttachment
                  key={index}
                  file={attachment}
                  onDelete={() => handleAttachmentDelete(attachment.url)}
                  showPreview={true}
                />
              ))
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">No attachments yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Add files or voice recordings to this note</p>
              </div>
            )}

            <div className="flex gap-2">
              <Dialog open={showFileUpload} onOpenChange={setShowFileUpload}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <PaperclipIcon className="h-4 w-4" />
                    Add File
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                  </DialogHeader>
                  <FileUpload onUploadComplete={handleFileUploadComplete} />
                </DialogContent>
              </Dialog>

              <Dialog open={showVoiceRecorder} onOpenChange={setShowVoiceRecorder}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <MicIcon className="h-4 w-4" />
                    Voice to Text
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Voice to Text</DialogTitle>
                  </DialogHeader>
                  <NoteVoiceTranscription
                    onTranscriptionComplete={(data) => {
                      if (data.audioUrl) {
                        handleVoiceRecordingComplete({
                          url: data.audioUrl,
                          filename: `Voice Recording (${data.duration || "unknown"})`,
                          contentType: "audio/webm",
                          duration: data.duration || "unknown",
                        })
                      }

                      // Insert the transcribed text into the note content
                      if (data.text) {
                        setContent((prev) => prev + "\n\n" + data.text)
                      }

                      setShowVoiceRecorder(false)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="outline" disabled={isSaving}>
          Discard Changes
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </div>
  )
}
