// Types for our command system
export interface CommandMatch {
  command: VoiceCommand
  params: Record<string, string>
  confidence: number
}

export interface VoiceCommand {
  id: string
  patterns: string[]
  description: string
  examples: string[]
  category: "navigation" | "action" | "creation"
  action: () => Promise<void>
}

export interface PatternMatch {
  match: boolean
  confidence: number
}

// Helper function to match a command pattern against user input
export function matchPattern(
  pattern: string,
  input: string,
): PatternMatch {
  const normalizedPattern = pattern.toLowerCase()
  const normalizedInput = input.toLowerCase()

  if (normalizedInput === normalizedPattern) {
    return { match: true, confidence: 1 }
  }

  // Check for partial matches
  if (normalizedInput.includes(normalizedPattern)) {
    return { match: true, confidence: 0.9 }
  }

  // Calculate similarity score
  const words = normalizedPattern.split(" ")
  const inputWords = normalizedInput.split(" ")
  let matchedWords = 0

  words.forEach((word) => {
    if (inputWords.includes(word)) {
      matchedWords++
    }
  })

  const similarity = matchedWords / words.length
  if (similarity > 0.7) {
    return { match: true, confidence: similarity }
  }

  return { match: false, confidence: 0 }
}

// Function to find the best matching command for a given input
export function findCommand(input: string, commands: VoiceCommand[]): CommandMatch | null {
  let bestMatch: CommandMatch | null = null

  for (const command of commands) {
    for (const pattern of command.patterns) {
      const { match, confidence } = matchPattern(pattern, input)

      if (match && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = {
          command,
          params: {},
          confidence,
        }
      }
    }
  }

  return bestMatch
}

// Function to get help text for available commands
export function getCommandHelp(
  commands: VoiceCommand[],
): { category: string; commands: Array<{ id: string; description: string; examples: string[] }> }[] {
  const categories = Array.from(new Set(commands.map((cmd) => cmd.category)))

  return categories.map((category) => {
    const categoryCommands = commands.filter((cmd) => cmd.category === category)
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      commands: categoryCommands.map((cmd) => ({
        id: cmd.id,
        description: cmd.description,
        examples: cmd.examples,
      })),
    }
  })
}
