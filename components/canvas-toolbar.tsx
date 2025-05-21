import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share, Download, Trash2, MoreVertical, Undo, Redo, ImageIcon, FileText, Layers } from "lucide-react"

export function CanvasToolbar({ canvasId }: { canvasId: string }) {
  return (
    <div className="flex items-center gap-1 border-b bg-background p-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Redo className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-6 w-px bg-border"></div>
        <Button variant="ghost" size="icon">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Layers className="h-4 w-4" />
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-1">
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
