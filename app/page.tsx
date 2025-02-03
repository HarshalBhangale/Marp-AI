import { Layout } from "@/components/layout"
import { ChatWindow } from "@/components/chat-window"
import { Portfolio } from "@/components/portfolio"
import { AgentActions } from "@/components/agent-actions"
import { Tweets } from "@/components/tweets"

export default function Home() {
  return (
    <Layout>
      <div className="flex h-full">
        <main className="flex-1 flex">
          <ChatWindow />
        </main>
        <div className="w-[400px] h-full overflow-auto p-4 space-y-4 bg-white/50 backdrop-blur-sm border-l border-yellow-600/20">
          <Portfolio />
          <AgentActions />
          <Tweets />
        </div>
      </div>
    </Layout>
  )
}