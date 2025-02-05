"use client"

import { LeftSidebar } from "./left-sidebar"
import { Navbar } from "@/components/navbar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <Navbar />
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          <LeftSidebar />
          <main className="flex-1 relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}