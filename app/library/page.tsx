"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const conversations = [
  {
    id: 1,
    title: "Portfolio Analysis",
    preview: "Let's analyze your current portfolio performance and suggest optimizations based on market conditions and risk tolerance.",
    date: "2024-02-10",
    tags: ["Portfolio", "Analysis"],
    saved: true,
  },
  {
    id: 2,
    title: "Market Research",
    preview: "Here's the latest analysis of the DeFi market trends and opportunities, focusing on emerging protocols and yield strategies.",
    date: "2024-02-09",
    tags: ["Market", "Research", "DeFi"],
    saved: true,
  },
  {
    id: 3,
    title: "Risk Assessment",
    preview: "Based on your portfolio composition, here's your current risk profile and recommendations for better diversification.",
    date: "2024-02-08",
    tags: ["Risk", "Analysis"],
    saved: true,
  },
  {
    id: 4,
    title: "Tax Planning",
    preview: "Let's review your trading history and identify opportunities for tax optimization before the end of the fiscal year.",
    date: "2024-02-07",
    tags: ["Tax", "Planning"],
    saved: true,
  },
  {
    id: 5,
    title: "Investment Strategy",
    preview: "Here's a personalized investment strategy based on your goals, risk tolerance, and market conditions.",
    date: "2024-02-06",
    tags: ["Strategy", "Investment"],
    saved: true,
  }
]

export default function LibraryPage() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Saved Conversations</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8 w-[300px]"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="hover:bg-yellow-50/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src="/ai-avatar.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{conversation.title}</h3>
                        <span className="text-sm text-muted-foreground">{conversation.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{conversation.preview}</p>
                      <div className="flex gap-2">
                        {conversation.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}