"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Token {
  name: string
  symbol: string
  amount: string
  value: number
  change24h: number
  logo: string
}

interface Position {
  protocol: string
  tokens: string[]
  value: number
  apy: number
  logo: string
}

const tokens: Token[] = [
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "3.20368",
    value: 5407.68,
    change24h: 6.49,
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
  {
    name: "Uniswap",
    symbol: "UNI",
    amount: "125.00",
    value: 4289.83,
    change24h: 252.81,
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
  },
  {
    name: "Dai",
    symbol: "DAI",
    amount: "200.75",
    value: 200.75,
    change24h: -0.02,
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  },
]

const positions: Position[] = [
  {
    protocol: "Uniswap",
    tokens: ["ETH", "USDC"],
    value: 4812.42,
    apy: 4.4,
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
  },
  {
    protocol: "Aave",
    tokens: ["ETH"],
    value: 2506.25,
    apy: 3.2,
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png",
  },
]

export function Portfolio() {
  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0)
  const positionsValue = positions.reduce((sum, pos) => sum + pos.value, 0)

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md">
      <CardContent className="p-6">
        {/* Header with total value */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/ai-avatar.png" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-3xl font-bold">${totalValue.toLocaleString()}</h2>
          <p className="text-sm text-muted-foreground">wallet.eth</p>
        </div>

        {/* Tokens List */}
        <div className="space-y-4 mb-8">
          {tokens.map((token) => (
            <div key={token.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={token.logo} alt={token.name} />
                  <AvatarFallback>{token.symbol}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{token.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {token.amount} {token.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${token.value.toLocaleString()}</p>
                <p className={`text-sm ${token.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {token.change24h > 0 ? "+" : ""}
                  {token.change24h}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Positions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Positions</h3>
            <p className="text-sm text-muted-foreground">${positionsValue.toLocaleString()}</p>
          </div>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={position.logo} alt={position.protocol} />
                    <AvatarFallback>{position.protocol[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{position.protocol}</h4>
                    <p className="text-sm text-muted-foreground">
                      {position.tokens.join("/")} • {position.apy}% APY
                    </p>
                  </div>
                </div>
                <p className="font-medium">${position.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}