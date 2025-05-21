import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileTextIcon, FolderIcon, ClockIcon } from "lucide-react"

export function Stats() {
  const stats = [
    {
      title: "Total Notes",
      value: "128",
      icon: <FileTextIcon className="h-4 w-4" />,
      change: "+12% from last month",
      positive: true,
    },
    {
      title: "Notebooks",
      value: "24",
      icon: <FolderIcon className="h-4 w-4" />,
      change: "+4 new notebooks",
      positive: true,
    },
    {
      title: "Time Saved",
      value: "8.5 hrs",
      icon: <ClockIcon className="h-4 w-4" />,
      change: "with AI assistance",
      positive: true,
    },
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="rounded-full bg-primary/10 p-1 text-primary">{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.positive ? "text-green-600" : "text-red-600"}`}>{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
