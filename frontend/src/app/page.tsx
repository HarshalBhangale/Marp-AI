import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <main className="flex-1 bg-gray-900">
        <ChatInterface />
      </main>
      <RightSidebar />
    </div>
  )
}
