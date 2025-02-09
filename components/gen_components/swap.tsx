"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BrowserProvider, formatEther, parseUnits } from 'ethers'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePrivy } from "@privy-io/react-auth"

interface SwapComponentProps {
  userPrompt: string
}

interface TokenData {
  address: string
  decimals: number
  symbol: string
  name: string
  logo: string
}

interface SwapDetails {
  fromToken: TokenData
  toToken: TokenData
  amount: string
  estimatedOutput?: string
  estimatedGas?: string
}

const TOKENS: { [key: string]: TokenData } = {
  'eth': {
    address: 'ETH',
    decimals: 18,
    symbol: 'ETH',
    name: 'Ethereum',
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
  },
  'usdc': {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
  }
}

export function SwapComponent({ userPrompt }: SwapComponentProps) {
  const { user, authenticated } = usePrivy()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [swapDetails, setSwapDetails] = useState<SwapDetails | null>(null)

  // Parse the user prompt to extract token pairs and amounts
  const parsePrompt = (prompt: string) => {
    const tokens = prompt.toLowerCase().match(/(swap|from|to)\s+([0-9.]+)?\s*([a-z]+)/g)
    if (!tokens || tokens.length < 2) {
      throw new Error('Invalid swap format. Please use format: "swap 0.1 eth to usdc"')
    }

    const fromMatch = tokens[0].match(/(swap|from)\s+([0-9.]+)?\s*([a-z]+)/)
    const toMatch = tokens[1].match(/to\s+([0-9.]+)?\s*([a-z]+)/)

    if (!fromMatch || !toMatch) {
      throw new Error('Invalid swap format')
    }

    return {
      fromAmount: fromMatch[2] || '1',
      fromToken: fromMatch[3],
      toToken: toMatch[2]
    }
  }

  const handleSwap = async () => {
    if (!authenticated || !user?.wallet?.address) {
      setError('Please connect your wallet first')
      return
    }

    try {
      setLoading(true)
      setError('')

      const { fromAmount, fromToken, toToken } = parsePrompt(userPrompt)
      
      const tokenFrom = TOKENS[fromToken]
      const tokenTo = TOKENS[toToken]

      if (!tokenFrom || !tokenTo) {
        throw new Error('Unsupported token pair')
      }

      // For demo purposes, we'll use a mock price
      const mockPrice = tokenTo.symbol === 'USDC' ? 2000 : 1/2000
      const amount = parseUnits(fromAmount, tokenFrom.decimals)
      const estimatedOutput = parseFloat(fromAmount) * mockPrice

      setSwapDetails({
        fromToken: tokenFrom,
        toToken: tokenTo,
        amount: fromAmount,
        estimatedOutput: estimatedOutput.toString(),
        estimatedGas: '150000'
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userPrompt) {
      handleSwap()
    }
  }, [userPrompt])

  if (loading) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md">
        <CardContent className="p-6">
          <div className="text-center text-yellow-900">Loading swap details...</div>
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

  if (!swapDetails) return null

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">Swap Details</h3>
        
        <div className="space-y-4">
          {/* From Token */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={swapDetails.fromToken.logo} alt={swapDetails.fromToken.name} />
                <AvatarFallback>{swapDetails.fromToken.symbol}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{swapDetails.fromToken.name}</p>
                <p className="text-sm text-muted-foreground">
                  {swapDetails.amount} {swapDetails.fromToken.symbol}
                </p>
              </div>
            </div>
          </div>

          {/* To Token */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={swapDetails.toToken.logo} alt={swapDetails.toToken.name} />
                <AvatarFallback>{swapDetails.toToken.symbol}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{swapDetails.toToken.name}</p>
                <p className="text-sm text-muted-foreground">
                  ≈ {parseFloat(swapDetails.estimatedOutput || '0').toFixed(6)} {swapDetails.toToken.symbol}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-yellow-600/10">
            <div className="text-sm text-muted-foreground mb-2">
              Estimated Gas: {swapDetails.estimatedGas} gwei
            </div>
            <Button 
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => {
                // Implement actual swap execution here
                console.log('Executing swap...')
              }}
            >
              Execute Swap
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
