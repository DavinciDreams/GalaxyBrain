"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCommandHelp } from "@/lib/voice-commands"
import { createCommandRegistry } from "@/lib/command-registry"
import { useRouter } from "next/navigation"

export function VoiceCommandHelp() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const commands = createCommandRegistry(router)
  const commandHelp = getCommandHelp(commands)

  useEffect(() => {
    const handleShowHelp = () => {
      setOpen(true)
    }

    window.addEventListener("show-voice-help", handleShowHelp)
    return () => {
      window.removeEventListener("show-voice-help", handleShowHelp)
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Voice Commands</DialogTitle>
          <DialogDescription>
            Here are all the available voice commands you can use with Galaxy Brain.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={commandHelp[0]?.category.toLowerCase() || "navigation"}>
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${commandHelp.length}, 1fr)` }}>
            {commandHelp.map((category) => (
              <TabsTrigger key={category.category} value={category.category.toLowerCase()}>
                {category.category}
              </TabsTrigger>
            ))}
          </TabsList>
          {commandHelp.map((category) => (
            <TabsContent key={category.category} value={category.category.toLowerCase()}>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-6">
                  {category.commands.map((command) => (
                    <div key={command.id} className="space-y-2">
                      <h3 className="font-medium">{command.description}</h3>
                      <div className="rounded-md bg-muted p-2">
                        <p className="text-sm text-muted-foreground">Examples:</p>
                        <ul className="ml-4 mt-1 list-disc text-sm">
                          {command.examples.map((example, i) => (
                            <li key={i}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
