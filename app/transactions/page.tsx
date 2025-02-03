"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const transactions = [
  {
    id: 1,
    type: "Swap",
    from: {
      symbol: "ETH",
      amount: "1.5",
      logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
    },
    to: {
      symbol: "USDC",
      amount: "2,850.75",
      logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    date: "2024-02-10 14:30",
    status: "completed",
    hash: "0x1234...5678",
  },
  // Add more transactions...
]

export default function TransactionsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <Badge variant="outline">{tx.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={tx.from.logo} />
                        <AvatarFallback>{tx.from.symbol}</AvatarFallback>
                      </Avatar>
                      <span>
                        {tx.from.amount} {tx.from.symbol}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={tx.to.logo} />
                        <AvatarFallback>{tx.to.symbol}</AvatarFallback>
                      </Avatar>
                      <span>
                        {tx.to.amount} {tx.to.symbol}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={tx.status === "completed" ? "success" : "secondary"}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {tx.hash}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}