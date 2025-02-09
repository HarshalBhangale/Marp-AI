import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <LeftSidebar />
      <main className="flex-1 bg-gray-900/50 backdrop-blur-sm rounded-lg m-4 border border-gray-700">
        <ChatInterface />
      </main>
      <RightSidebar />
    </div>
  )
}
