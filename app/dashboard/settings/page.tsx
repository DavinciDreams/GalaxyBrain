"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { MoonIcon, SunIcon, VolumeIcon, Volume2Icon } from "lucide-react"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [voiceFeedback, setVoiceFeedback] = useState(true)
  const { toast } = useToast()

  // Check system theme preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if dark mode is enabled
      const isDarkMode = document.documentElement.classList.contains("dark")
      setDarkMode(isDarkMode)

      // Listen for theme toggle events
      const handleThemeToggle = () => {
        setDarkMode((prev) => !prev)
      }

      window.addEventListener("theme-toggle", handleThemeToggle)

      return () => {
        window.removeEventListener("theme-toggle", handleThemeToggle)
      }
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    // Update document class
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    toast({
      title: newDarkMode ? "Dark Mode Enabled" : "Light Mode Enabled",
      description: `Switched to ${newDarkMode ? "dark" : "light"} mode`,
    })
  }

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated",
    })
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how Galaxy Brain looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {darkMode ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voice Interface</CardTitle>
            <CardDescription>Configure voice commands and feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <VolumeIcon className="h-5 w-5" />
                <Label htmlFor="voice-enabled">Voice Commands</Label>
              </div>
              <Switch id="voice-enabled" checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2Icon className="h-5 w-5" />
                <Label htmlFor="voice-feedback">Voice Feedback</Label>
              </div>
              <Switch
                id="voice-feedback"
                checked={voiceFeedback}
                onCheckedChange={setVoiceFeedback}
                disabled={!voiceEnabled}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}
