'use client'
import { Layout } from "@/components/layout"
import { ChatWindow } from "@/components/chat-window"
import { RightSidebar } from "@/components/right-sidebar"
import { useLogin } from "@privy-io/react-auth"

function Home() {
  return (
    <Layout>
      <div className="flex h-full">
        <div className="flex-1 relative">
          <ChatWindow />
        </div>
        <RightSidebar />
      </div>
    </Layout>
  )
}

export default Home;
