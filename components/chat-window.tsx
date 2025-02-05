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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 border-2 border-yellow-600/20">
                <AvatarImage src="/ai-avatar.png" />
                <AvatarFallback className="bg-yellow-100 text-yellow-900">AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-yellow-900">AI Assistant</span>
                  <span className="text-xs text-yellow-600/60">10:56:57</span>
                </div>
                <p className="text-yellow-900/80 leading-relaxed">
                  Hello! I&#39;m Marp. The ETH AI Rockstar 🚀
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-br from-yellow-50 to-orange-50 border-t border-yellow-600/20 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border-yellow-600/20 focus:ring-yellow-600/30 bg-white/80 backdrop-blur-sm"
          />
          <Button 
            size="icon" 
            className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-md"
            variant="default"
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-md"
            variant="default"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}