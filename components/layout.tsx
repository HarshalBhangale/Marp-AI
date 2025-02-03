"use client"

import { LeftSidebar } from "./left-sidebar"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <LeftSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}