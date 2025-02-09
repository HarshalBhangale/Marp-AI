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