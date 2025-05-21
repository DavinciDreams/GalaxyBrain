// Type definitions for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
  interpretation: any
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  start(): void
  stop(): void
  abort(): void
}

// Safely check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get the correct Speech Recognition constructor based on browser
const getSpeechRecognitionAPI = (): any => {
  if (!isBrowser) return null
  return window.SpeechRecognition || (window as any).webkitSpeechRecognition || null
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null
  private isListening = false
  private onResultCallback: ((transcript: string, isFinal: boolean) => void) | null = null
  private onEndCallback: (() => void) | null = null
  private onErrorCallback: ((error: string) => void) | null = null

  constructor() {
    // Only initialize if in browser
    if (isBrowser) {
      const SpeechRecognitionAPI = getSpeechRecognitionAPI()
      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI()
        this.setupRecognition()
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = "en-US"
    this.recognition.maxAlternatives = 1

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const resultIndex = event.resultIndex
      const transcript = event.results[resultIndex][0].transcript
      const isFinal = event.results[resultIndex].isFinal

      if (this.onResultCallback) {
        this.onResultCallback(transcript, isFinal)
      }
    }

    this.recognition.onend = () => {
      this.isListening = false
      if (this.onEndCallback) {
        this.onEndCallback()
      }
    }

    this.recognition.onerror = (event) => {
      if (this.onErrorCallback) {
        this.onErrorCallback((event as any).error)
      }
    }
  }

  public isSupported(): boolean {
    return isBrowser && !!getSpeechRecognitionAPI()
  }

  public start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onEnd: () => void,
    onError: (error: string) => void,
  ): boolean {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser")
      return false
    }

    if (this.isListening) {
      return true
    }

    this.onResultCallback = onResult
    this.onEndCallback = onEnd
    this.onErrorCallback = onError

    try {
      this.recognition.start()
      this.isListening = true
      return true
    } catch (error) {
      onError("Failed to start speech recognition")
      return false
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  public isActive(): boolean {
    return this.isListening
  }
}

// Singleton instance
let speechRecognitionInstance: SpeechRecognitionService | null = null

export function getSpeechRecognition(): SpeechRecognitionService {
  if (!speechRecognitionInstance) {
    speechRecognitionInstance = new SpeechRecognitionService()
  }
  return speechRecognitionInstance
}
