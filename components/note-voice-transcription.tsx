"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { MicIcon, StopCircleIcon, Loader2Icon } from "lucide-react"
import { transcribeAudio } from "@/lib/ai-service"
import { speechService } from "@/lib/speech-service"

interface NoteVoiceTranscriptionProps {
  onTranscriptionComplete: (result: { text: string }) => void
  maxDuration?: number
}

export function NoteVoiceTranscription({ onTranscriptionComplete, maxDuration = 300 }: NoteVoiceTranscriptionProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsSpeechSupported(speechService.isSupported())
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= maxDuration) {
            stopRecording()
            return prevTime
          }
          return prevTime + 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRecording, maxDuration])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      setIsRecording(true)
      setRecordingTime(0)
      setTranscript("")

      const startTranscription = await transcribeAudio()
      const transcriptionSession = await startTranscription()

      // Handle real-time transcription updates
      speechService.start(
        (result) => {
          setTranscript(result.text)
          if (result.isFinal && result.text) {
            setTranscript(result.text)
          }
        },
        (error) => {
          console.error("Speech recognition error:", error)
          toast({
            title: "Speech Recognition Error",
            description: error,
            variant: "destructive",
          })
          stopRecording()
        },
        () => {
          // On end - do nothing, we'll handle this when stopping recording
        },
      )
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive",
      })
      setIsRecording(false)
    }
  }

  const stopRecording = async () => {
    if (!isRecording) return

    setIsRecording(false)
    setIsProcessing(true)

    try {
      // Stop the speech recognition
      speechService.stop()

      if (transcript) {
        onTranscriptionComplete({ text: transcript })
      }
    } catch (error) {
      console.error("Error stopping recording:", error)
      toast({
        title: "Error",
        description: "Failed to process recording",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isSpeechSupported) {
    return (
      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">
          Speech recognition is not supported in your browser. Please try using a modern browser like Chrome, Edge, or Safari.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {isRecording ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
            <span className="text-sm font-medium">Recording... {formatTime(recordingTime)}</span>
          </div>
          <Progress value={(recordingTime / maxDuration) * 100} />

          {transcript && (
            <div className="rounded-md border p-3">
              <p className="text-sm">{transcript}</p>
            </div>
          )}

          <Button variant="destructive" onClick={stopRecording} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <StopCircleIcon className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            )}
          </Button>
        </div>
      ) : (
        <Button onClick={startRecording} className="w-full">
          <MicIcon className="mr-2 h-4 w-4" />
          Start Recording
        </Button>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        {isRecording
          ? `Maximum recording time: ${formatTime(maxDuration)}`
          : "Click the button to start recording and transcribing"}
      </p>
    </div>
  )
}
