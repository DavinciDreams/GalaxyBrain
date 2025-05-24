"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { MicIcon, StarIcon } from "lucide-react"

interface Note {
  id: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  hasVoice: boolean
  isFavorite: boolean
}

export function NoteList() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch("/api/notes")
        if (!response.ok) {
          throw new Error("Failed to fetch notes")
        }
        const data = await response.json()
        setNotes(data)
      } catch (error) {
        console.error("Error fetching notes:", error)
        toast({
          title: "Error",
          description: "Failed to load notes",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [toast])

  const toggleFavorite = async (noteId: string) => {
    try {
      const note = notes.find((n) => n.id === noteId)
      if (!note) return

      const response = await fetch(`/api/notes/${noteId}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFavorite: !note.isFavorite }),
      })

      if (!response.ok) {
        throw new Error("Failed to update favorite status")
      }

      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.id === noteId ? { ...n, isFavorite: !n.isFavorite } : n
        )
      )
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
              <div className="flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
                <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-medium">No notes yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first note to get started
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/notes/new">Create Note</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Link
                href={`/dashboard/notes/${note.id}`}
                className="block font-medium hover:text-primary"
              >
                {note.title}
              </Link>
              <p className="text-sm text-muted-foreground">{note.excerpt}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
              onClick={() => toggleFavorite(note.id)}
            >
              <StarIcon
                className={note.isFavorite ? "fill-primary text-primary" : ""}
              />
              <span className="sr-only">
                {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
              </span>
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            {note.hasVoice && (
              <Badge variant="secondary" className="gap-1">
                <MicIcon className="h-3 w-3" />
                Voice
              </Badge>
            )}
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">
              {note.date}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}
