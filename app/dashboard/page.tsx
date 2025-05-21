import { NoteList } from "@/components/note-list"
import { RecentActivity } from "@/components/recent-activity"
import { Stats } from "@/components/stats"
import { Button } from "@/components/ui/button"
import { PlusIcon, MicIcon } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <PlusIcon className="h-4 w-4" />
            New Note
          </Button>
          <Button size="sm" className="gap-1">
            <MicIcon className="h-4 w-4" />
            Voice Note
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Stats />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NoteList />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
