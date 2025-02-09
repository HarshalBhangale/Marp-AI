import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'

export default function Library() {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <main className="flex-1 bg-gray-900 p-8">
        <h1 className="text-2xl font-bold mb-6">Trading Library</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Trading Strategies */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Trading Strategies</h2>
            <ul className="space-y-3">
              <li className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                <span className="mr-2">  </span>
                Technical Analysis Basics
              </li>
              <li className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                <span className="mr-2">📈</span>
                Trend Following
              </li>
              <li className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                <span className="mr-2">⚖️</span>
                Risk Management
              </li>
            </ul>
          </div>

          {/* Market Analysis */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
            <ul className="space-y-3">
              <li className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                <span className="mr-2">🌍</span>
                Global Markets Overview
              </li>
              <li className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                <span className="mr-2">📰</span>
                News Impact Analysis
              </li>
              <li className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                <span className="mr-2">  </span>
                Market Indicators
              </li>
            </ul>
          </div>

          {/* Trading Tools */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Trading Tools</h2>
            <ul className="space-y-3">
              <li className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                <span className="mr-2">🔧</span>
                Calculator Suite
              </li>
              <li className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                <span className="mr-2">📱</span>
                Mobile Trading
              </li>
              <li className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                <span className="mr-2">⚡</span>
                API Documentation
              </li>
            </ul>
          </div>
        </div>
      </main>
      <RightSidebar />
    </div>
  )
} 