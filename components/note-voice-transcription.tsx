"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { MicIcon, StopCircleIcon, Loader2Icon, PlayIcon, PauseIcon } from "lucide-react"
import { uploadVoiceRecording } from "@/app/actions/blob-actions"
import { getSpeechRecognition } from "@/lib/speech-recognition"

interface NoteVoiceTranscriptionProps {
  onTranscriptionComplete: (data: {
    text: string
    audioUrl?: string
    duration?: string
  }) => void
  maxDuration?: number // in seconds
}

export function NoteVoiceTranscription({ onTranscriptionComplete, maxDuration = 300 }: NoteVoiceTranscriptionProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { toast } = useToast()

  // Check if speech recognition is supported
  useEffect(() => {
    const speechRecognition = getSpeechRecognition()
    setIsSpeechSupported(speechRecognition.isSupported())
  }, [])

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (isRecording) {
        stopRecording()
      }
    }
  }, [audioUrl, isRecording])

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Start audio recording
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

        // Stop all tracks from the stream
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      setTranscript("")

      // Start speech recognition if supported
      if (isSpeechSupported) {
        const speechRecognition = getSpeechRecognition()
        speechRecognition.start(
          (text, isFinal) => {
            if (isFinal) {
              setTranscript((prev) => prev + " " + text)
            } else {
              // For interim results, we could show them differently
              // but for simplicity, we'll just update the transcript
              setTranscript(text)
            }
          },
          () => {
            // On end - do nothing, we'll handle this when stopping recording
          },
          (error) => {
            // On error
            console.error("Speech recognition error:", error)
            toast({
              title: "Speech Recognition Error",
              description: error,
              variant: "destructive",
            })
          },
        )
      } else {
        toast({
          title: "Speech Recognition Not Available",
          description: "Your browser doesn't support speech recognition. Audio will be recorded without transcription.",
          variant: "warning",
        })
      }

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= maxDuration) {
            stopRecording()
            return prevTime
          }
          return prevTime + 1
        })
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record audio",
        variant: "destructive",
      })
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        // Resume recording
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1)
        }, 1000)
      } else {
        // Pause recording
        mediaRecorderRef.current.pause()
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
      setIsPaused(!isPaused)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Stop speech recognition
      if (isSpeechSupported) {
        const speechRecognition = getSpeechRecognition()
        speechRecognition.stop()
      }
    }
  }

  const handleSave = async () => {
    if (!audioUrl && !transcript) return

    setIsUploading(true)

    try {
      if (audioUrl) {
        // If we have audio, upload it
        const response = await fetch(audioUrl)
        const audioBlob = await response.blob()

        const formData = new FormData()
        formData.append("audio", audioBlob)
        formData.append("duration", formatTime(recordingTime))
        formData.append("transcript", transcript)

        const result = await uploadVoiceRecording(formData)

        if (result.success) {
          toast({
            title: "Recording saved",
            description: "Your voice recording has been saved",
          })

          onTranscriptionComplete({
            text: transcript,
            audioUrl: result.url,
            duration: formatTime(recordingTime),
          })
        } else {
          throw new Error(result.error)
        }
      } else if (transcript) {
        // If we only have transcript (no audio), just return the text
        onTranscriptionComplete({
          text: transcript,
        })

        toast({
          title: "Transcription saved",
          description: "Your transcription has been saved",
        })
      }

      // Reset state
      setAudioUrl(null)
      setRecordingTime(0)
      setTranscript("")
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save recording",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handlePlaybackEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">Voice to Text</h3>
        {recordingTime > 0 && !isRecording && (
          <span className="text-sm text-muted-foreground">Duration: {formatTime(recordingTime)}</span>
        )}
      </div>

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

          <div className="flex gap-2">
            <Button variant="outline" onClick={pauseRecording}>
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button variant="destructive" onClick={stopRecording}>
              <StopCircleIcon className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          </div>
        </div>
      ) : audioUrl ? (
        <div className="space-y-4">
          <audio ref={audioRef} src={audioUrl} onEnded={handlePlaybackEnded} className="hidden" />

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={togglePlayback}>
              {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            </Button>
            <div className="h-10 flex-1 rounded-md bg-muted">
              <div
                className="h-full rounded-md bg-primary/20"
                style={{ width: isPlaying ? "100%" : "0%", transition: "width 1s linear" }}
              ></div>
            </div>
          </div>

          {transcript && (
            <div className="rounded-md border p-3">
              <p className="text-sm">{transcript}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAudioUrl(null)
                setTranscript("")
              }}
              className="flex-1"
            >
              Discard
            </Button>
            <Button onClick={handleSave} disabled={isUploading} className="flex-1">
              {isUploading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Use Transcription"
              )}
            </Button>
          </div>
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
