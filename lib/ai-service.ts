import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function summarizeNote(content: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Summarize the following note content in bullet points, extracting the key ideas:
      
      ${content}`,
    })

    return text
  } catch (error) {
    console.error("Error summarizing note:", error)
    return "Unable to generate summary at this time."
  }
}

export async function generateInsights(content: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze the following note content and provide insights:
      1. Related concepts and topics (as tags)
      2. Suggested resources that might be helpful
      3. Potential next steps
      
      Note content:
      ${content}`,
    })

    return text
  } catch (error) {
    console.error("Error generating insights:", error)
    return "Unable to generate insights at this time."
  }
}

export async function transcribeAudio(audioBlob: Blob) {
  try {
    // This is a placeholder for actual audio transcription
    // In a real implementation, you would use a service like OpenAI's Whisper API
    return "This is a transcribed text from the audio recording."
  } catch (error) {
    console.error("Error transcribing audio:", error)
    return "Unable to transcribe audio at this time."
  }
}

export async function translateContent(content: string, targetLanguage: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Translate the following content to ${targetLanguage}:
      
      ${content}`,
    })

    return text
  } catch (error) {
    console.error("Error translating content:", error)
    return "Unable to translate content at this time."
  }
}
