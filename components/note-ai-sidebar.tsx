"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2Icon, XIcon, RefreshCwIcon } from "lucide-react"

export function NoteAISidebar({ noteId }: { noteId: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(true)

  // Simulate loading AI analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [noteId])

  if (!isOpen) {
    return (
      <div className="border-l bg-background p-2">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="h-8 w-8">
          <span className="sr-only">Open AI sidebar</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M21 13V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5" />
            <path d="M21 13H3" />
            <path d="M12 20V8" />
          </svg>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 border-l bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">AI Assistant</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      {isLoading ? (
        <div className="flex h-[calc(100%-57px)] items-center justify-center">
          <div className="text-center">
            <Loader2Icon className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Analyzing your note...</p>
          </div>
        </div>
      ) : (
        <div className="h-[calc(100%-57px)] overflow-auto p-4">
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Key Points</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="space-y-2">
                    <li>• Implementing a voice-first interface with speech-to-text and voice commands</li>
                    <li>• Integrating AI for note summarization and organization</li>
                    <li>• Developing an infinite canvas with stylus support and multi-touch gestures</li>
                    <li>• Adding handwriting recognition and conversion to text</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Summary</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>
                    This note outlines the key features for a project focused on creating an advanced note-taking
                    application. The project emphasizes voice interaction, AI-powered features, and an intuitive canvas
                    interface with support for various input methods.
                  </p>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="gap-1">
                  <RefreshCwIcon className="h-3 w-3" />
                  Regenerate
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="insights" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Related Concepts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Speech Recognition</Badge>
                    <Badge variant="secondary">Natural Language Processing</Badge>
                    <Badge variant="secondary">Text-to-Speech</Badge>
                    <Badge variant="secondary">Machine Learning</Badge>
                    <Badge variant="secondary">UX Design</Badge>
                    <Badge variant="secondary">Gesture Controls</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Suggested Resources</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="space-y-2">
                    <li>• Web Speech API for speech recognition and synthesis</li>
                    <li>• Canvas API for drawing and infinite canvas</li>
                    <li>• Pointer Events API for stylus input</li>
                    <li>• OpenAI API for AI-powered features</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="actions" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Suggested Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Create task list from note
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Schedule follow-up meeting
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Research speech recognition APIs
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Share with team members
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Ask AI Assistant</CardTitle>
                  <CardDescription className="text-xs">Ask questions about this note or get help</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Expand on AI features
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Suggest timeline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
