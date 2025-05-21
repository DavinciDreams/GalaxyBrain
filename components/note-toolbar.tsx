import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
  Link,
  MoreVertical,
  Share,
  Download,
  Trash2,
  MicIcon,
  StarIcon,
} from "lucide-react"

export function NoteToolbar({ noteId }: { noteId: string }) {
  return (
    <div className="flex items-center gap-1 border-b bg-background p-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <StarIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MicIcon className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Share className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              <span>Export</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
