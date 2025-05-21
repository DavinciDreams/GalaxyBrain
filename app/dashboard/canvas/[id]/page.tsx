import { CanvasEditor } from "@/components/canvas-editor"
import { CanvasToolbar } from "@/components/canvas-toolbar"

export default function CanvasPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-full flex-col">
      <CanvasToolbar canvasId={params.id} />
      <CanvasEditor canvasId={params.id} />
    </div>
  )
}
