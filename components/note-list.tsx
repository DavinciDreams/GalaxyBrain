import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileTextIcon, StarIcon, MoreHorizontalIcon, MicIcon } from "lucide-react"
import Link from "next/link"

export function NoteList() {
  // Mock data for demonstration
  const notes = [
    {
      id: "1",
      title: "Project Brainstorming",
      excerpt: "Ideas for the new Galaxy Brain application...",
      date: "2 hours ago",
      tags: ["project", "ideas"],
      hasVoice: true,
      isFavorite: true,
    },
    {
      id: "2",
      title: "Meeting Notes: Product Team",
      excerpt: "Discussed roadmap for Q3 and feature prioritization...",
      date: "Yesterday",
      tags: ["meeting", "product"],
      hasVoice: true,
      isFavorite: false,
    },
    {
      id: "3",
      title: "Research: AI Integration",
      excerpt: "Exploring options for AI-powered note summarization...",
      date: "3 days ago",
      tags: ["research", "ai"],
      hasVoice: false,
      isFavorite: true,
    },
    {
      id: "4",
      title: "UI Design Ideas",
      excerpt: "Sketches and concepts for the canvas interface...",
      date: "1 week ago",
      tags: ["design", "ui"],
      hasVoice: false,
      isFavorite: false,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Recent Notes</CardTitle>
        <Button variant="ghost" size="sm" className="ml-auto">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.map((note) => (
            <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
              <div className="group flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                  <FileTextIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{note.title}</h3>
                    {note.hasVoice && <MicIcon className="ml-2 h-3 w-3 text-muted-foreground" />}
                    {note.isFavorite && <StarIcon className="ml-2 h-3 w-3 fill-yellow-400 text-yellow-400" />}
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{note.excerpt}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{note.date}</span>
                    <div className="flex gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
