import type { VoiceCommand } from "./voice-commands"
import { toast } from "@/hooks/use-toast"
import { matchPattern } from "./voice-commands"

// We'll need these imports for navigation
import type { useRouter } from "next/navigation"

interface CommandRegistry {
  commands: VoiceCommand[]
  findCommand: (input: string) => VoiceCommand | null
}

// Command registry factory - we need to create it with router access
export function createCommandRegistry(router: ReturnType<typeof useRouter>): CommandRegistry {
  // Define all available commands
  const commands: VoiceCommand[] = [
    // Navigation commands
    {
      id: "navigate-home",
      patterns: [
        "go to dashboard",
        "go home",
        "show dashboard",
        "open dashboard",
        "navigate to dashboard",
        "take me to dashboard",
      ],
      description: "Navigate to the dashboard",
      examples: ["Go to dashboard", "Show dashboard"],
      category: "navigation",
      action: async () => {
        router.push("/dashboard")
        toast({
          title: "Navigating to Dashboard",
          description: "Opening the dashboard view",
        })
      },
    },
    {
      id: "navigate-notes",
      patterns: ["go to notes", "show notes", "open notes", "navigate to notes", "take me to notes", "view my notes"],
      description: "Navigate to notes list",
      examples: ["Go to notes", "Show my notes"],
      category: "navigation",
      action: async () => {
        router.push("/dashboard/notes")
        toast({
          title: "Navigating to Notes",
          description: "Opening your notes",
        })
      },
    },
    {
      id: "navigate-notebooks",
      patterns: [
        "go to notebooks",
        "show notebooks",
        "open notebooks",
        "navigate to notebooks",
        "take me to notebooks",
        "view my notebooks",
      ],
      description: "Navigate to notebooks",
      examples: ["Go to notebooks", "Show my notebooks"],
      category: "navigation",
      action: async () => {
        router.push("/dashboard/notebooks")
        toast({
          title: "Navigating to Notebooks",
          description: "Opening your notebooks",
        })
      },
    },
    {
      id: "navigate-favorites",
      patterns: [
        "go to favorites",
        "show favorites",
        "open favorites",
        "navigate to favorites",
        "take me to favorites",
        "view my favorites",
        "show starred notes",
      ],
      description: "Navigate to favorites",
      examples: ["Go to favorites", "Show my favorites"],
      category: "navigation",
      action: async () => {
        router.push("/dashboard/favorites")
        toast({
          title: "Navigating to Favorites",
          description: "Opening your favorite notes",
        })
      },
    },
    {
      id: "navigate-archived",
      patterns: [
        "go to archive",
        "show archive",
        "open archive",
        "navigate to archive",
        "take me to archive",
        "view archived notes",
        "show archived",
      ],
      description: "Navigate to archived notes",
      examples: ["Go to archive", "Show archived notes"],
      category: "navigation",
      action: async () => {
        router.push("/dashboard/archived")
        toast({
          title: "Navigating to Archive",
          description: "Opening your archived notes",
        })
      },
    },
    {
      id: "navigate-trash",
      patterns: [
        "go to trash",
        "show trash",
        "open trash",
        "navigate to trash",
        "take me to trash",
        "view deleted notes",
        "show deleted",
      ],
      description: "Navigate to trash",
      examples: ["Go to trash", "Show deleted notes"],
      category: "navigation",
      action: async () => {
        router.push("/dashboard/trash")
        toast({
          title: "Navigating to Trash",
          description: "Opening your deleted notes",
        })
      },
    },
    {
      id: "navigate-settings",
      patterns: [
        "go to settings",
        "show settings",
        "open settings",
        "navigate to settings",
        "take me to settings",
        "change settings",
      ],
      description: "Navigate to settings",
      examples: ["Go to settings", "Open settings"],
      category: "navigation",
      action: async () => {
        router.push("/dashboard/settings")
        toast({
          title: "Navigating to Settings",
          description: "Opening settings",
        })
      },
    },
    {
      id: "navigate-tools",
      patterns: ["go to tools", "show tools", "open tools", "navigate to tools", "take me to tools"],
      description: "Navigate to tools",
      examples: ["Go to tools", "Open tools"],
      category: "navigation",
      action: async () => {
        router.push("/dashboard/tools")
        toast({
          title: "Navigating to Tools",
          description: "Opening tools",
        })
      },
    },
    {
      id: "navigate-ocr",
      patterns: [
        "go to OCR",
        "open OCR",
        "navigate to OCR",
        "take me to OCR",
        "open text extraction",
        "go to text extraction",
      ],
      description: "Navigate to OCR tool",
      examples: ["Go to OCR", "Open text extraction"],
      category: "navigation",
      action: async () => {
        router.push("/dashboard/tools/ocr")
        toast({
          title: "Navigating to OCR Tool",
          description: "Opening the OCR text extraction tool",
        })
      },
    },
    {
      id: "navigate-note",
      patterns: [
        "open note {title}",
        "show note {title}",
        "go to note {title}",
        "navigate to note {title}",
        "find note {title}",
      ],
      description: "Navigate to a specific note by title",
      examples: ["Open note Project Ideas", "Show note Meeting Minutes"],
      category: "navigation",
      action: async (params) => {
        // In a real app, you would search for the note by title
        // For now, we'll just show a toast
        toast({
          title: "Note Search",
          description: `Searching for note: "${params.title}"`,
        })

        // Simulate finding the note (in a real app, you'd query your database)
        setTimeout(() => {
          router.push(`/dashboard/notes/1`)
          toast({
            title: "Note Found",
            description: `Opening note: "${params.title}"`,
          })
        }, 1000)
      },
    },

    // Creation commands
    {
      id: "create-note",
      patterns: ["create new note", "new note", "start new note", "create note", "add note"],
      description: "Create a new note",
      examples: ["Create new note", "New note"],
      category: "creation",
      action: async () => {
        router.push("/dashboard/notes/new")
        toast({
          title: "Creating New Note",
          description: "Opening the note editor",
        })
      },
    },
    {
      id: "create-titled-note",
      patterns: [
        "create note called {title}",
        "new note called {title}",
        "create note titled {title}",
        "new note titled {title}",
        "create note about {title}",
        "new note about {title}",
      ],
      description: "Create a new note with a specific title",
      examples: ["Create note called Meeting Notes", "New note about Project Ideas"],
      category: "creation",
      action: async (params) => {
        // In a real app, you would create a note with this title
        // For now, we'll just navigate to the new note page
        router.push(`/dashboard/notes/new?title=${encodeURIComponent(params.title)}`)
        toast({
          title: "Creating New Note",
          description: `Creating note titled: "${params.title}"`,
        })
      },
    },
    {
      id: "create-notebook",
      patterns: ["create new notebook", "new notebook", "start new notebook", "create notebook", "add notebook"],
      description: "Create a new notebook",
      examples: ["Create new notebook", "New notebook"],
      category: "creation",
      action: async () => {
        router.push("/dashboard/notebooks/new")
        toast({
          title: "Creating New Notebook",
          description: "Opening the notebook creation form",
        })
      },
    },
    {
      id: "create-titled-notebook",
      patterns: [
        "create notebook called {title}",
        "new notebook called {title}",
        "create notebook titled {title}",
        "new notebook titled {title}",
        "create notebook for {title}",
        "new notebook for {title}",
      ],
      description: "Create a new notebook with a specific title",
      examples: ["Create notebook called Work", "New notebook for Personal"],
      category: "creation",
      action: async (params) => {
        // In a real app, you would create a notebook with this title
        router.push(`/dashboard/notebooks/new?title=${encodeURIComponent(params.title)}`)
        toast({
          title: "Creating New Notebook",
          description: `Creating notebook titled: "${params.title}"`,
        })
      },
    },

    // Search commands
    {
      id: "search",
      patterns: ["search for {query}", "find {query}", "look for {query}", "search {query}"],
      description: "Search for notes",
      examples: ["Search for project ideas", "Find meeting notes"],
      category: "search",
      action: async (params) => {
        router.push(`/dashboard/search?q=${encodeURIComponent(params.query)}`)
        toast({
          title: "Searching",
          description: `Searching for: "${params.query}"`,
        })
      },
    },

    // System commands
    {
      id: "toggle-theme",
      patterns: [
        "toggle theme",
        "switch theme",
        "change theme",
        "toggle dark mode",
        "toggle light mode",
        "switch to dark mode",
        "switch to light mode",
      ],
      description: "Toggle between light and dark theme",
      examples: ["Toggle theme", "Switch to dark mode"],
      category: "system",
      action: async () => {
        // In a real app, you would toggle the theme
        // For now, we'll just show a toast
        toast({
          title: "Theme Toggled",
          description: "Switching between light and dark mode",
        })

        // This would be implemented with your theme context
        const event = new CustomEvent("theme-toggle")
        window.dispatchEvent(event)
      },
    },
    {
      id: "help",
      patterns: [
        "show help",
        "help",
        "show commands",
        "list commands",
        "what can I say",
        "voice commands help",
        "show voice commands",
      ],
      description: "Show available voice commands",
      examples: ["Show help", "What can I say"],
      category: "system",
      action: async () => {
        // This would open a help dialog
        const event = new CustomEvent("show-voice-help")
        window.dispatchEvent(event)

        toast({
          title: "Voice Commands Help",
          description: "Showing available voice commands",
        })
      },
    },
    {
      id: "go-back",
      patterns: ["go back", "navigate back", "previous page", "back"],
      description: "Navigate to the previous page",
      examples: ["Go back", "Previous page"],
      category: "navigation",
      action: async () => {
        router.back()
        toast({
          title: "Navigating Back",
          description: "Going to the previous page",
        })
      },
    },
  ]

  return {
    commands,
    findCommand: (input: string) => {
      let bestMatch: VoiceCommand | null = null
      let highestConfidence = 0

      for (const command of commands) {
        for (const pattern of command.patterns) {
          const { match, confidence } = matchPattern(pattern, input.toLowerCase())
          if (match && confidence > highestConfidence) {
            highestConfidence = confidence
            bestMatch = command
          }
        }
      }

      return bestMatch
    },
  }
}
