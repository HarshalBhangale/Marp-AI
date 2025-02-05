"use client"

import { Portfolio } from "@/components/portfolio"
import { AgentActions } from "@/components/agent-actions"
import { Tweets } from "@/components/tweets"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'agents' | 'tweets'>('portfolio')

  return (
    <div className="w-[400px] h-full flex flex-col overflow-hidden bg-white/50 backdrop-blur-sm border-l border-yellow-600/20">
      <div className="p-4 flex flex-col h-full">
        {/* Tab List */}
        <div className="flex space-x-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={cn(
              'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all',
              activeTab === 'portfolio' 
                ? 'bg-white text-yellow-900 shadow'
                : 'text-muted-foreground hover:bg-white/50'
            )}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={cn(
              'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all',
              activeTab === 'agents'
                ? 'bg-white text-yellow-900 shadow'
                : 'text-muted-foreground hover:bg-white/50'
            )}
          >
            Agents
          </button>
          <button
            onClick={() => setActiveTab('tweets')}
            className={cn(
              'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all',
              activeTab === 'tweets'
                ? 'bg-white text-yellow-900 shadow'
                : 'text-muted-foreground hover:bg-white/50'
            )}
          >
            Tweets
          </button>
        </div>

        {/* Tab Content - Added overflow handling */}
        <div className="mt-4 flex-1 overflow-y-auto">
          {activeTab === 'portfolio' && <Portfolio />}
          {activeTab === 'agents' && <AgentActions />}
          {activeTab === 'tweets' && <Tweets />}
        </div>
      </div>
    </div>
  )
}
