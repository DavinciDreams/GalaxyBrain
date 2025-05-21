import { NoteEditor } from "@/components/note-editor"
import { NoteToolbar } from "@/components/note-toolbar"
import { NoteAISidebar } from "@/components/note-ai-sidebar"

export default function NotePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <NoteToolbar noteId={params.id} />
        <NoteEditor noteId={params.id} />
      </div>
      <NoteAISidebar noteId={params.id} />
    </div>
  )
}
