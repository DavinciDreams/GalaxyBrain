/// <reference path="./speech-types.ts" />

interface TranscriptionResult {
  text: string
  confidence: number
  isFinal: boolean
}

export class SpeechService {
  private recognition: SpeechRecognition | null = null
  private isListening: boolean = false
  private onResultCallback: ((result: TranscriptionResult) => void) | null = null
  private onErrorCallback: ((error: string) => void) | null = null
  private onEndCallback: (() => void) | null = null
  private transcriptParts: string[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.setupRecognition()
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.maxAlternatives = 1
    this.recognition.lang = 'en-US'

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1]
      const transcript = result[0].transcript
      const confidence = result[0].confidence
      const isFinal = result.isFinal

      if (isFinal) {
        this.transcriptParts.push(transcript)
      }

      if (this.onResultCallback) {
        this.onResultCallback({
          text: isFinal ? this.transcriptParts.join(' ') : transcript,
          confidence,
          isFinal
        })
      }
    }

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error)
      }
    }

    this.recognition.onend = () => {
      this.isListening = false
      if (this.onEndCallback) {
        this.onEndCallback()
      }
    }
  }

  public start(
    onResult: (result: TranscriptionResult) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ) {
    if (!this.recognition) {
      throw new Error('Speech recognition is not supported in this browser')
    }

    if (this.isListening) {
      this.stop()
    }

    this.transcriptParts = []
    this.onResultCallback = onResult
    this.onErrorCallback = onError || null
    this.onEndCallback = onEnd || null

    this.recognition.start()
    this.isListening = true
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  public isSupported(): boolean {
    return !!(typeof window !== 'undefined' && 
      // @ts-ignore
      (window.SpeechRecognition || window.webkitSpeechRecognition))
  }
}

// Create a singleton instance
export const speechService = new SpeechService()