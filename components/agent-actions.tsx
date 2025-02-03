"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react"

const actions = [
  {
    name: "Market Analysis",
    status: "completed",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    name: "Portfolio Rebalancing",
    status: "in progress",
    icon: Clock,
    color: "text-blue-500",
  },
  {
    name: "Risk Assessment",
    status: "pending",
    icon: AlertCircle,
    color: "text-yellow-500",
  },
  {
    name: "Tax Optimization",
    status: "failed",
    icon: XCircle,
    color: "text-red-500",
  },
]

export function AgentActions() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-yellow-900">Agent Actions & Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <div key={action.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${action.color}`} />
                  <span>{action.name}</span>
                </div>
                <Badge
                  variant={
                    action.status === "completed"
                      ? "default"
                      : action.status === "in progress"
                      ? "secondary"
                      : action.status === "pending"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {action.status}
                </Badge>
              </div>
            )
          })}
        </div>
        <Button className="w-full mt-4">View All Actions</Button>
      </CardContent>
    </Card>
  )
}