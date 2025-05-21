import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  // Mock data for demonstration
  const activities = [
    {
      id: "1",
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "YO",
      },
      action: "created a new note",
      target: "Project Brainstorming",
      time: "2 hours ago",
    },
    {
      id: "2",
      user: {
        name: "Sarah K.",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SK",
      },
      action: "commented on",
      target: "Meeting Notes: Product Team",
      time: "Yesterday",
    },
    {
      id: "3",
      user: {
        name: "AI Assistant",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AI",
      },
      action: "summarized",
      target: "Research: AI Integration",
      time: "3 days ago",
    },
    {
      id: "4",
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "YO",
      },
      action: "added to favorites",
      target: "Project Brainstorming",
      time: "3 days ago",
    },
    {
      id: "5",
      user: {
        name: "Michael T.",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MT",
      },
      action: "shared",
      target: "UI Design Ideas",
      time: "1 week ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
