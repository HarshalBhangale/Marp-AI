'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Library, BarChart2 } from 'lucide-react'

const navigation = [
  { name: 'Chat', href: '/', icon: MessageSquare },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Transactions', href: '/transactions', icon: BarChart2 },
]

export default function LeftSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-800">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white">Trading Bot</h2>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 