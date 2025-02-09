'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Library, BarChart2, TrendingUp, TrendingDown } from 'lucide-react'

const navigation = [
  { name: 'Chat', href: '/', icon: MessageSquare },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Transactions', href: '/transactions', icon: BarChart2 },
]

const LeftSidebar = () => {
  return (
    <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Market Overview Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Market Overview</h2>
          
          {/* Bitcoin Card */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Bitcoin</span>
              <span className="text-sm text-gray-400">BTC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">$48,234.21</span>
              <div className="flex items-center text-green-400">
                <TrendingUp size={16} className="mr-1" />
                <span>+2.4%</span>
              </div>
            </div>
          </div>

          {/* Ethereum Card */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Ethereum</span>
              <span className="text-sm text-gray-400">ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">$2,854.12</span>
              <div className="flex items-center text-red-400">
                <TrendingDown size={16} className="mr-1" />
                <span>-0.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Connect Wallet
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Buy
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar 