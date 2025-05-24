"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FileTextIcon, FolderIcon, ClockIcon } from "lucide-react"

interface StatsData {
  totalNotes: number
  notebooks: number
  timeSaved: number
  notesChange: number
  notebooksChange: number
}

export function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
        toast({
          title: "Error",
          description: "Failed to load statistics",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  function formatTimeSaved(hours: number): string {
    if (hours < 1) {
      return `${Math.round(hours * 60)} mins`
    }
    return `${hours.toFixed(1)} hrs`
  }

  function formatChange(value: number): string {
    if (value > 0) {
      return `+${value}%`
    }
    return `${value}%`
  }

  if (isLoading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
              <div className="mt-1 h-4 w-24 animate-pulse rounded bg-muted"></div>
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  if (!stats) {
    return null
  }

  const statItems = [
    {
      title: "Total Notes",
      value: stats.totalNotes.toString(),
      icon: <FileTextIcon className="h-4 w-4" />,
      change: `${formatChange(stats.notesChange)} from last month`,
      positive: stats.notesChange > 0,
    },
    {
      title: "Notebooks",
      value: stats.notebooks.toString(),
      icon: <FolderIcon className="h-4 w-4" />,
      change: `${formatChange(stats.notebooksChange)} from last month`,
      positive: stats.notebooksChange > 0,
    },
    {
      title: "Time Saved",
      value: formatTimeSaved(stats.timeSaved),
      icon: <ClockIcon className="h-4 w-4" />,
      change: "with AI assistance",
      positive: true,
    },
  ]

  return (
    <>
      {statItems.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="rounded-full bg-primary/10 p-1 text-primary">{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.positive ? "text-green-600" : "text-red-600"}`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
