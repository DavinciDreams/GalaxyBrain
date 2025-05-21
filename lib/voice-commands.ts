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
  category: "navigation" | "creation" | "editing" | "search" | "system"
  action: (params: Record<string, string>) => Promise<void>
}

// Helper function to match a command pattern against user input
function matchPattern(
  pattern: string,
  input: string,
): { match: boolean; params: Record<string, string>; confidence: number } {
  // Convert both to lowercase for case-insensitive matching
  const patternLower = pattern.toLowerCase()
  const inputLower = input.toLowerCase()

  // Direct match
  if (patternLower === inputLower) {
    return { match: true, params: {}, confidence: 1.0 }
  }

  // Check for pattern with parameters
  if (pattern.includes("{") && pattern.includes("}")) {
    const regex = new RegExp(
      "^" +
        pattern
          .toLowerCase()
          .replace(/\s+/g, "\\s+")
          .replace(/{(\w+)}/g, "(.*?)") +
        "$",
    )

    const paramNames = pattern.match(/{(\w+)}/g)?.map((p) => p.replace(/{|}/g, "")) || []
    const match = inputLower.match(regex)

    if (match) {
      const params: Record<string, string> = {}
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1]
      })

      // Calculate confidence based on how much of the pattern is fixed vs. parameters
      const fixedTextLength = pattern.replace(/{(\w+)}/g, "").length
      const confidence = fixedTextLength / pattern.length

      return { match: true, params, confidence }
    }
  }

  // Fuzzy match (simple implementation)
  const words = patternLower.split(" ")
  const inputWords = inputLower.split(" ")

  let matchedWords = 0
  words.forEach((word) => {
    if (inputWords.includes(word)) {
      matchedWords++
    }
  })

  const confidence = matchedWords / words.length
  if (confidence > 0.7) {
    return { match: true, params: {}, confidence }
  }

  return { match: false, params: {}, confidence: 0 }
}

// Function to find the best matching command for a given input
export function findCommand(input: string, commands: VoiceCommand[]): CommandMatch | null {
  let bestMatch: CommandMatch | null = null

  for (const command of commands) {
    for (const pattern of command.patterns) {
      const { match, params, confidence } = matchPattern(pattern, input)

      if (match && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = {
          command,
          params,
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
