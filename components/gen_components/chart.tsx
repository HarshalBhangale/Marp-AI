"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { SwapComponent } from "./swap"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

// Dynamically import TradingView widget to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import('react-tradingview-widget'),
  { ssr: false }
)

interface ChartComponentProps {
  userPrompt: string
}

interface TokenInfo {
  symbol: string
  pair: string
  exchange: string
  name: string
}

const SUPPORTED_TOKENS: { [key: string]: TokenInfo } = {
  'eth': {
    symbol: 'ETH',
    pair: 'ETHUSDT',
    exchange: 'BINANCE',
    name: 'Ethereum'
  },
  'btc': {
    symbol: 'BTC',
    pair: 'BTCUSDT',
    exchange: 'BINANCE',
    name: 'Bitcoin'
  },
  'usdc': {
    symbol: 'USDC',
    pair: 'USDCUSDT',
    exchange: 'BINANCE',
    name: 'USD Coin'
  }
  // Add more tokens as needed
}

export function ChartComponent({ userPrompt }: ChartComponentProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [tokenPair, setTokenPair] = useState<string>('')
  const [showSwap, setShowSwap] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [currentToken, setCurrentToken] = useState<TokenInfo | null>(null)

  const parsePrompt = (prompt: string) => {
    const tokenMatch = prompt.toLowerCase().match(/chart\s+([a-z0-9]+)/i)
    if (!tokenMatch) {
      throw new Error('Invalid chart format. Please use format: "chart eth" or "chart btc"')
    }
    return tokenMatch[1]
  }

  useEffect(() => {
    try {
      const token = parsePrompt(userPrompt)
      const tokenInfo = SUPPORTED_TOKENS[token.toLowerCase()]

      if (!tokenInfo) {
        throw new Error(`Token ${token} not supported for charting`)
      }

      setTokenPair(`${tokenInfo.exchange}:${tokenInfo.pair}`)
      setCurrentToken(tokenInfo)
      setShowSwap(true)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [userPrompt])

  if (loading) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md">
        <CardContent className="p-6">
          <div className="text-center text-yellow-900">Loading chart...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md">
        <CardContent className="p-6">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const ChartContent = () => (
    <div className={`relative ${isFullScreen ? 'fixed inset-0 z-50 bg-white' : 'w-full'}`}>
      <div className={`
        ${isFullScreen ? 'absolute inset-0' : 'h-[400px]'}
        ${isFullScreen ? 'p-4' : ''}
      `}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-yellow-900">
              {currentToken?.name} Price Chart
            </h3>
            <span className="text-sm text-yellow-600">
              {currentToken?.pair}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hover:bg-yellow-50"
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            {isFullScreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullScreen(false)}
                className="hover:bg-yellow-50"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className={`${isFullScreen ? 'h-[calc(100%-4rem)]' : 'h-full'}`}>
          <TradingViewWidget
            symbol={tokenPair}
            theme="light"
            autosize
            interval="D"
            timezone="Etc/UTC"
            style="1"
            locale="en"
            toolbar_bg="#f1f1f1"
            enable_publishing={false}
            hide_side_toolbar={false}
            allow_symbol_change={true}
            save_image={false}
            container_id="tradingview_chart"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <Card className={`w-full bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md 
        ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
        <CardContent className={`${isFullScreen ? 'p-0' : 'p-6'}`}>
          <ChartContent />
        </CardContent>
      </Card>

      {showSwap && !isFullScreen && (
        <SwapComponent userPrompt={`swap 0.1 ${parsePrompt(userPrompt)} to usdc`} />
      )}
    </div>
  )
}
