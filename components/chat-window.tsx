/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SwapComponent } from "./gen_components/swap"



interface ChatMessage {
  type: 'user' | 'ai'
  content: string | React.ReactNode
  timestamp: string
}

export function ChatWindow() {
  const [message, setMessage] = useState("")
  const [showVoiceAI, setShowVoiceAI] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: 'ai',
      content: "Hello! I'm Marp. The ETH AI Rockstar 🚀",
      timestamp: '10:56:57'
    }
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const currentTime = new Date().toLocaleTimeString()
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      type: 'user',
      content: message,
      timestamp: currentTime
    }

    // Generate AI response based on message content
    let aiResponse: ChatMessage
    
    if (message.toLowerCase().includes('swap')) {
      aiResponse = {
        type: 'ai',
        content: <SwapComponent userPrompt={message} />,
        timestamp: currentTime
      }
    
    } else {
      aiResponse = {
        type: 'ai',
        content: "I understand you want to interact with me. I can help you with:\n1. Token swaps (try 'swap 0.1 eth to usdc')\n2. Price charts (try 'chart eth')\n3. Voice interaction (click the mic button)",
        timestamp: currentTime
      }
    }

    setChatHistory(prev => [...prev, userMessage, aiResponse])
    setMessage("")
  }

  const handleMicClick = () => {
    setShowVoiceAI(true)
    // Add a message to chat history about voice mode
    const currentTime = new Date().toLocaleTimeString()
    const aiResponse: ChatMessage = {
      type: 'ai',
      content: (
        <div className="space-y-4">
          <p>Switching to voice interaction mode. I can help you with:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Token swaps (say "swap 0.1 eth to usdc")</li>
            <li>Price charts (say "show me eth chart")</li>
            <li>Market information and more</li>
          </ul>

          <div className="mt-2">

          </div>
        </div>
      ),
      timestamp: currentTime
    }
    setChatHistory(prev => [...prev, aiResponse])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          {chatHistory.map((msg, index) => (
            <Card key={index} className="p-4 bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 border-2 border-yellow-600/20">
                  <AvatarImage 
                    src={msg.type === 'ai' ? "/ai-avatar.png" : "/user-avatar.png"} 
                  />
                  <AvatarFallback className="bg-yellow-100 text-yellow-900">
                    {msg.type === 'ai' ? 'AI' : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-yellow-900">
                      {msg.type === 'ai' ? 'AI Assistant' : 'You'}
                    </span>
                    <span className="text-xs text-yellow-600/60">{msg.timestamp}</span>
                  </div>
                  <div className="text-yellow-900/80 leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-br from-yellow-50 to-orange-50 border-t border-yellow-600/20 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage()
              }
            }}
            className="flex-1 border-yellow-600/20 focus:ring-yellow-600/30 bg-white/80 backdrop-blur-sm"
          />
          <Button 
            size="icon" 
            className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-md"
            variant="default"
            onClick={handleMicClick}
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-md"
            variant="default"
            onClick={handleSendMessage}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}