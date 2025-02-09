export interface Message {
  id: number
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface Transaction {
  id: number
  type: 'buy' | 'sell'
  asset: string
  amount: string
  price: string
  total: string
  status: 'completed' | 'pending'
  date: string
}

export interface TradingActivity {
  type: 'BUY' | 'SELL'
  price: number
  amount: number
  timestamp: Date
  fees: number
}

export interface TradePerformance {
  averageEntry: number
  totalProfit: number
  totalFees: number
  roi: number
}

export interface TradeState {
  selectedToken: string
  strategy: string
  riskLevel: string
  amount: number
  isChartExpanded: boolean
  trades: TradingActivity[]
  performance: TradePerformance
} 