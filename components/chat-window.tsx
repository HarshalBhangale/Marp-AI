"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ChatWindow() {
  const [message, setMessage] = useState("")

  return (
    <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto px-4">
      <div className="flex-1 overflow-auto py-4">
        <div className="space-y-4">
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="/ai-avatar.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">AI Assistant</span>
                  <span className="text-sm text-muted-foreground">10:56:57</span>
                </div>
                <p>Hello! I'm your AI financial assistant. How can I help you today?</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="py-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button size="icon" className="bg-yellow-500 hover:bg-yellow-600">
            <Mic className="w-4 h-4" />
          </Button>
          <Button size="icon" className="bg-yellow-500 hover:bg-yellow-600">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}