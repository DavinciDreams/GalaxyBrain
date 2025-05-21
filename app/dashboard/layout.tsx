import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { VoiceActionButton } from "@/components/voice-action-button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">{children}</main>
        <VoiceActionButton />
      </div>
    </div>
  )
}
