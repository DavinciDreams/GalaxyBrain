import { generateText } from "ai"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

interface OpenRouterResponse {
  choices: Array<{
    text: string
    message: {
      content: string
      role: string
    }
    index: number
    finish_reason: string
  }>
}

async function callOpenRouter(messages: any[], model: string = "anthropic/claude-2") {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://galaxybrain.ai",
      "X-Title": "Galaxy Brain",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`)
  }

  const data: OpenRouterResponse = await response.json()
  return data.choices[0].message.content
}

export async function summarizeNote(content: string) {
  try {
    const text = await callOpenRouter([
      {
        role: "system",
        content: "You are a helpful AI assistant that summarizes notes and extracts key points.",
      },
      {
        role: "user",
        content: `Summarize the following note content in bullet points, extracting the key ideas:\n\n${content}`,
      },
    ], "anthropic/claude-2") // Claude is great at summarization

    return text
  } catch (error) {
    console.error("Error summarizing note:", error)
    throw new Error("Failed to generate summary")
  }
}

export async function generateInsights(content: string) {
  try {
    const text = await callOpenRouter([
      {
        role: "system",
        content: "You are a helpful AI assistant that analyzes notes and provides insights.",
      },
      {
        role: "user",
        content: `Analyze the following note content and provide insights:
        1. Related concepts and topics (as tags)
        2. Suggested resources that might be helpful
        3. Potential next steps

        Note content:
        ${content}`,
      },
    ], "gpt-4") // GPT-4 is great for complex analysis

    return text
  } catch (error) {
    console.error("Error generating insights:", error)
    throw new Error("Failed to generate insights")
  }
}

import { speechService } from './speech-service'

interface TranscriptionController {
  stop: () => void;
}

export async function transcribeAudio(): Promise<() => Promise<{ text: string; controller: TranscriptionController }>> {
  return async () => {
    return new Promise((resolve, reject) => {
      if (!speechService.isSupported()) {
        reject(new Error('Speech recognition is not supported in this browser'))
        return
      }

      let finalTranscript = ''
      const controller: TranscriptionController = {
        stop: () => {
          speechService.stop()
          resolve({ text: finalTranscript, controller })
        }
      }

      speechService.start(
        (result: { text: string; isFinal: boolean }) => {
          if (result.isFinal) {
            finalTranscript = result.text
          }
        },
        (error: string) => {
          reject(new Error(`Speech recognition error: ${error}`))
        },
        () => {
          resolve({ text: finalTranscript, controller })
        }
      )
    })
  }
}

export async function translateContent(content: string, targetLanguage: string) {
  try {
    const text = await callOpenRouter([
      {
        role: "system",
        content: `You are a helpful AI assistant that translates text to ${targetLanguage} while preserving formatting and context.`,
      },
      {
        role: "user",
        content: content,
      },
    ], "meta-llama/llama-2-70b") // Llama 2 70B is great for translation

    return text
  } catch (error) {
    console.error("Error translating content:", error)
    throw new Error("Failed to translate content")
  }
}
