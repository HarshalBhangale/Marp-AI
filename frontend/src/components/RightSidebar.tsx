'use client'

import { WalletConnect } from './WalletConnect'

interface MarketData {
  symbol: string
  name: string
  price: string
  change: string
  isPositive: boolean
}

const marketData: MarketData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '48,234.21',
    change: '+2.4%',
    isPositive: true,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '2,854.12',
    change: '-0.8%',
    isPositive: false,
  },
]

export default function RightSidebar() {
  return (
    <div className="flex flex-col w-80 bg-gray-900 border-l border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Market Overview</h2>
      </div>
      <div className="p-4 space-y-4">
        {marketData.map((asset) => (
          <div key={asset.symbol} className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-400">{asset.name}</h3>
                <p className="text-xs text-gray-500">{asset.symbol}</p>
              </div>
              <span className={`text-sm ${asset.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {asset.change}
              </span>
            </div>
            <div className="text-xl font-bold text-white">${asset.price}</div>
          </div>
        ))}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-400">Quick Actions</h3>
            <WalletConnect />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              Buy
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 