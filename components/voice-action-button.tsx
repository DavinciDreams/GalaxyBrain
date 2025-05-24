"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { MicIcon, StopCircleIcon, Loader2Icon } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { createCommandRegistry } from "@/lib/command-registry"
import { transcribeAudio } from "@/lib/ai-service"
import { speechService } from "@/lib/speech-service"

export function VoiceActionButton() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const commands = createCommandRegistry(router)

  useEffect(() => {
    setIsSpeechSupported(speechService.isSupported())
  }, [])

  const startListening = async () => {
    try {
      setIsListening(true)
      setTranscript("")
      setCommandFeedback(null)
      setIsProcessing(false)

      const startTranscription = await transcribeAudio()
      const transcriptionSession = await startTranscription()

      speechService.start(
        (result) => {
          setTranscript(result.text)
          if (result.isFinal && result.text) {
            handleVoiceCommand(result.text)
          }
        },
        (error) => {
          console.error("Speech recognition error:", error)
          toast({
            title: "Speech Recognition Error",
            description: error,
            variant: "destructive",
          })
          stopListening()
        },
        () => {
          // On end - handled by stopListening
        }
      )
    } catch (error) {
      console.error("Error starting voice command:", error)
      toast({
        title: "Error",
        description: "Failed to start voice command",
        variant: "destructive",
      })
      stopListening()
    }
  }

  const stopListening = () => {
    setIsListening(false)
    speechService.stop()
  }  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true)
    try {
      const matchedCommand = commands.findCommand(command)
      if (matchedCommand) {
        const feedback = `Executing: ${matchedCommand.description}`
        setCommandFeedback(feedback)
        await matchedCommand.action()
        toast({
          title: "Command executed",
          description: matchedCommand.description,
        })
      } else {
        const feedback = "No matching command found"
        setCommandFeedback(feedback)
        toast({
          title: "Unknown command",
          description: "Could not find a matching command",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error executing command:", error)
      toast({
        title: "Command failed",
        description: error instanceof Error ? error.message : "Failed to execute command",
        variant: "destructive",
      })    } finally {
      setIsProcessing(false);
      stopListening();
    }
  },

  if (!isSpeechSupported) {
    return null // Hide the button if speech is not supported
  }

  return (
    <Button
      variant={isListening ? "destructive" : "default"}
      size="icon"
      className="h-8 w-8"
      onClick={isListening ? stopListening : startListening}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2Icon className="h-4 w-4 animate-spin" />
      ) : isListening ? (
        <StopCircleIcon className="h-4 w-4" />
      ) : (
        <MicIcon className="h-4 w-4" />
      )}
    </Button>
  )
}
