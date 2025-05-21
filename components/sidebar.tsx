"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BrainCircuit,
  Home,
  FileText,
  Folder,
  Star,
  Archive,
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  PenToolIcon as Tool,
} from "lucide-react"
import { Input } from "@/components/ui/input"

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b px-3">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 font-bold">
            <BrainCircuit className="h-6 w-6" />
            <span>Galaxy Brain</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <BrainCircuit className="h-6 w-6" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 py-2">
          {!collapsed && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search notes..." className="pl-8" />
            </div>
          )}
          {collapsed && (
            <Button variant="ghost" size="icon" className="mx-auto">
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
        <nav className="grid gap-1 px-2 group-[.collapsed]/sidebar:px-2">
          <NavItem
            href="/dashboard"
            icon={<Home className="h-4 w-4" />}
            label="Dashboard"
            collapsed={collapsed}
            active={pathname === "/dashboard"}
          />
          <NavItem
            href="/dashboard/notes"
            icon={<FileText className="h-4 w-4" />}
            label="Notes"
            collapsed={collapsed}
            active={pathname.startsWith("/dashboard/notes")}
          />
          <NavItem
            href="/dashboard/notebooks"
            icon={<Folder className="h-4 w-4" />}
            label="Notebooks"
            collapsed={collapsed}
            active={pathname.startsWith("/dashboard/notebooks")}
          />
          <NavItem
            href="/dashboard/favorites"
            icon={<Star className="h-4 w-4" />}
            label="Favorites"
            collapsed={collapsed}
            active={pathname.startsWith("/dashboard/favorites")}
          />
          <NavItem
            href="/dashboard/archived"
            icon={<Archive className="h-4 w-4" />}
            label="Archived"
            collapsed={collapsed}
            active={pathname.startsWith("/dashboard/archived")}
          />
          <NavItem
            href="/dashboard/trash"
            icon={<Trash2 className="h-4 w-4" />}
            label="Trash"
            collapsed={collapsed}
            active={pathname.startsWith("/dashboard/trash")}
          />
          <NavItem
            href="/dashboard/tools"
            icon={<Tool className="h-4 w-4" />}
            label="Tools"
            collapsed={collapsed}
            active={pathname.startsWith("/dashboard/tools")}
          />
        </nav>
        {!collapsed && (
          <div className="mt-4 px-3">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">NOTEBOOKS</h3>
            <nav className="grid gap-1">
              <NotebookItem label="Personal" count={12} />
              <NotebookItem label="Work" count={8} />
              <NotebookItem label="Projects" count={5} />
              <NotebookItem label="Ideas" count={3} />
              <Button variant="ghost" size="sm" className="justify-start gap-2 px-2">
                <Plus className="h-4 w-4" />
                <span>New Notebook</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
      <div className="mt-auto border-t p-2">
        <NavItem
          href="/dashboard/settings"
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
          collapsed={collapsed}
          active={pathname.startsWith("/dashboard/settings")}
        />
      </div>
    </div>
  )
}

function NavItem({
  href,
  icon,
  label,
  collapsed,
  active,
}: {
  href: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  active: boolean
}) {
  return (
    <Link href={href}>
      <Button
        variant={active ? "secondary" : "ghost"}
        size={collapsed ? "icon" : "sm"}
        className={cn("w-full justify-start", collapsed ? "h-9 w-9 p-0" : "px-2")}
      >
        {icon}
        {!collapsed && <span className="ml-2">{label}</span>}
      </Button>
    </Link>
  )
}

function NotebookItem({ label, count }: { label: string; count: number }) {
  return (
    <Button variant="ghost" size="sm" className="justify-start px-2">
      <Folder className="mr-2 h-4 w-4" />
      <span className="flex-1 truncate">{label}</span>
      <span className="ml-auto text-xs text-muted-foreground">{count}</span>
    </Button>
  )
}
