"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MicIcon, StopCircleIcon, Loader2Icon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSpeechRecognition } from "@/lib/speech-recognition"
import { uploadVoiceRecording } from "@/app/actions/blob-actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export function VoiceActionButton() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showDialog, setShowDialog] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [mode, setMode] = useState<"command" | "note">("command")
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Check if speech recognition is supported
  useEffect(() => {
    const speechRecognition = getSpeechRecognition()
    setIsSpeechSupported(speechRecognition.isSupported())
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      stopListening()
    }
  }, [audioUrl])

  const startListening = async () => {
    setShowDialog(true)
    setMode("command")

    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true })

      // Start recording audio for backup
      startAudioRecording()

      // Start speech recognition if supported
      if (isSpeechSupported) {
        const speechRecognition = getSpeechRecognition()
        speechRecognition.start(
          (text, isFinal) => {
            if (isFinal) {
              setTranscript((prev) => prev + " " + text)
            } else {
              setTranscript(text)
            }
          },
          () => {
            // On end
            setIsListening(false)
          },
          (error) => {
            // On error
            console.error("Speech recognition error:", error)
            toast({
              title: "Speech Recognition Error",
              description: error,
              variant: "destructive",
            })
            setIsListening(false)
          },
        )
      } else {
        toast({
          title: "Speech Recognition Not Available",
          description: "Your browser doesn't support speech recognition. Audio will be recorded without transcription.",
          variant: "warning",
        })
      }

      setIsListening(true)
      setTranscript("")
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice commands",
        variant: "destructive",
      })
    }
  }

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        setIsRecording(false)

        // Stop all tracks from the stream
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting audio recording:", error)
    }
  }

  const stopListening = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (isSpeechSupported) {
      const speechRecognition = getSpeechRecognition()
      speechRecognition.stop()
    }

    setIsListening(false)

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    if (transcript.trim()) {
      processCommand(transcript)
    }
  }

  const processCommand = (command: string) => {
    setIsProcessing(true)

    // Simulate processing the command
    setTimeout(() => {
      setIsProcessing(false)

      toast({
        title: "Command recognized",
        description: `"${command}"`,
      })

      // Close dialog after processing
      setShowDialog(false)
      setTranscript("")
    }, 1500)
  }

  const handleCreateNote = async () => {
    setMode("note")
    setIsProcessing(true)

    try {
      if (audioUrl) {
        const response = await fetch(audioUrl)
        const audioBlob = await response.blob()

        const formData = new FormData()
        formData.append("audio", audioBlob)
        formData.append("duration", formatTime(recordingTime))
        formData.append("transcript", transcript)

        const result = await uploadVoiceRecording(formData)

        if (result.success) {
          toast({
            title: "Voice note created",
            description: "Your voice note has been saved",
          })

          // Reset state and close dialog
          setAudioUrl(null)
          setRecordingTime(0)
          setTranscript("")
          setShowDialog(false)
        } else {
          throw new Error(result.error)
        }
      } else if (transcript) {
        // If we have transcript but no audio, create a text note
        toast({
          title: "Note created",
          description: "Your note has been saved",
        })

        // Reset state and close dialog
        setTranscript("")
        setShowDialog(false)
      }
    } catch (error) {
      toast({
        title: "Error creating note",
        description: error instanceof Error ? error.message : "Failed to create note",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleClose = () => {
    stopListening()
    setShowDialog(false)
    setTranscript("")
    setAudioUrl(null)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg" onClick={startListening}>
          <MicIcon className="h-6 w-6" />
          <span className="sr-only">Voice Command</span>
        </Button>
      </div>

      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          if (!open) handleClose()
          setShowDialog(open)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{mode === "command" ? "Voice Command" : "Voice Note"}</DialogTitle>
            <DialogDescription>
              {isListening ? "Listening... Speak clearly into your microphone." : "Your voice has been recorded."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isListening && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">Recording... {formatTime(recordingTime)}</span>
                </div>
                <Progress value={(recordingTime / 300) * 100} />
              </div>
            )}

            {transcript && (
              <div className="rounded-md border p-3">
                <p className="text-sm">{transcript}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              {isListening ? (
                <Button variant="destructive" onClick={stopListening}>
                  <StopCircleIcon className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNote} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Create Note"
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
