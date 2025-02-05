"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePrivy } from "@privy-io/react-auth"
import { useEffect, useState } from "react"
import { JsonRpcProvider, formatEther, parseEther } from "ethers"

// Sepolia testnet configuration
const SEPOLIA_RPC = "https://eth-sepolia.g.alchemy.com/v2/AXW5yWl-EY8nFHF_gQp1otiKxEz4YMwh"

// Test tokens on Sepolia (you can add more test tokens here)
const SEPOLIA_TOKENS = {
  ETH: {
    symbol: "SEP-ETH",
    name: "Sepolia ETH",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
  }
}

interface TokenBalance {
  symbol: string
  name: string
  balance: string
  value: number
  logo: string
}

export function Portfolio() {
  const { user, authenticated } = usePrivy()
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBalances = async () => {
      if (!authenticated || !user?.wallet?.address) return

      try {
        setIsLoading(true)
        const provider = new JsonRpcProvider(SEPOLIA_RPC)
        const walletAddress = user.wallet.address

        // Fetch Sepolia ETH balance
        const balance = await provider.getBalance(walletAddress)
        const ethBalance = formatEther(balance)
        
        // Using a mock price for Sepolia ETH since it's testnet
        const mockEthPrice = 2000
        const value = parseFloat(ethBalance) * mockEthPrice

        const sepoliaBalance: TokenBalance = {
          ...SEPOLIA_TOKENS.ETH,
          balance: ethBalance,
          value
        }

        setBalances([sepoliaBalance])
        setTotalValue(value)

      } catch (error) {
        console.error("Error fetching balances:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalances()
  }, [authenticated, user?.wallet?.address])

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md">
      <CardContent className="p-6">
        {/* Total Value */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            ${isLoading ? "..." : totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {user?.wallet?.address ? 
              `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 
              'Connect Wallet'
            }
          </p>
        </div>

        {/* Tokens List */}
        <div className="space-y-4 mb-8">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading balances...</div>
          ) : balances.length > 0 ? (
            balances.map((token) => (
              <div key={token.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={token.logo} alt={token.name} />
                    <AvatarFallback>{token.symbol}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{token.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {parseFloat(token.balance).toFixed(4)} {token.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">No tokens found</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}