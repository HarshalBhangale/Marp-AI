import { useQuery } from '@tanstack/react-query'

export interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

const BINANCE_API_BASE = 'https://api.binance.com/api/v3'

export const fetchKlines = async (
  symbol: string,
  interval: string = '1h',
  limit: number = 100
): Promise<CandlestickData[]> => {
  const response = await fetch(
    `${BINANCE_API_BASE}/klines?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`
  )
  const data = await response.json()
  
  return data.map((item: any) => ({
    time: new Date(item[0]).toISOString().split('T')[0],
    open: parseFloat(item[1]),
    high: parseFloat(item[2]),
    low: parseFloat(item[3]),
    close: parseFloat(item[4]),
    volume: parseFloat(item[5]),
  }))
}

export const useKlines = (symbol: string, interval: string = '1h') => {
  return useQuery({
    queryKey: ['klines', symbol, interval],
    queryFn: () => fetchKlines(symbol, interval),
    refetchInterval: 10000, // Refetch every 10 seconds
  })
}

export const fetchLatestPrice = async (symbol: string): Promise<number> => {
  const response = await fetch(
    `${BINANCE_API_BASE}/ticker/price?symbol=${symbol}USDT`
  )
  const data = await response.json()
  return parseFloat(data.price)
}

export const useLatestPrice = (symbol: string) => {
  return useQuery({
    queryKey: ['price', symbol],
    queryFn: () => fetchLatestPrice(symbol),
    refetchInterval: 5000, // Refetch every 5 seconds
  })
} 