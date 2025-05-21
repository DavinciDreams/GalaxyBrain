"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2Icon, SearchIcon, FileTextIcon } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<any[]>([])

  // Simulate search when query changes
  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm: string) => {
    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      // Mock results
      const mockResults = [
        {
          id: "1",
          title: `Project Brainstorming: ${searchTerm}`,
          excerpt: `Ideas for the new Galaxy Brain application related to ${searchTerm}...`,
          date: "2 hours ago",
          tags: ["project", "ideas"],
        },
        {
          id: "2",
          title: `Meeting Notes: ${searchTerm} Team`,
          excerpt: `Discussed roadmap for Q3 and feature prioritization for ${searchTerm}...`,
          date: "Yesterday",
          tags: ["meeting", "product"],
        },
        {
          id: "3",
          title: `Research: ${searchTerm} Integration`,
          excerpt: `Exploring options for ${searchTerm}-powered note summarization...`,
          date: "3 days ago",
          tags: ["research", "ai"],
        },
      ]

      setResults(mockResults)
      setIsSearching(false)
    }, 1000)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Update URL with search query
      const url = new URL(window.location.href)
      url.searchParams.set("q", searchQuery)
      window.history.pushState({}, "", url.toString())

      performSearch(searchQuery)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Search</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search your notes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>{query ? `Search Results for "${query}"` : "Recent Searches"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <Link key={result.id} href={`/dashboard/notes/${result.id}`}>
                  <div className="group flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                      <FileTextIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <h3 className="font-medium">{result.title}</h3>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{result.excerpt}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{result.date}</span>
                        <div className="flex gap-1">
                          {result.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Try searching for notes, notebooks, or content</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
