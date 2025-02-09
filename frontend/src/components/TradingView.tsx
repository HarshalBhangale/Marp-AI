'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, CrosshairMode, Time } from 'lightweight-charts'
import type { IChartApi, DeepPartial, ChartOptions, SeriesOptionsCommon, ISeriesApi, LineData, CandlestickData } from 'lightweight-charts'
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
  VStack,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ButtonGroup,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Circle,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Progress,
} from '@chakra-ui/react'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  ChevronDown,
  MessageCircle,
  Brain,
  Target,
  BarChart2,
  RefreshCw,
  Timer,
  AlertTriangle,
} from 'lucide-react'
import { TradeState } from '@/types'
import useInterval from '@/hooks/useInterval'

interface TradingViewProps {
  tradeState: TradeState
}

interface TradeSignal {
  type: 'BUY' | 'SELL'
  amount: number
  price: number
  timestamp: Date
  fees: number
  reason: string
}

const TradingView = ({ tradeState }: TradingViewProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chart = useRef<IChartApi | null>(null)
  const [timeframe, setTimeframe] = useState('1m')
  const [tradeSignals, setTradeSignals] = useState<TradeSignal[]>([])
  const [currentStrategy, setCurrentStrategy] = useState(tradeState.strategy)
  const [isChangingStrategy, setIsChangingStrategy] = useState(false)
  const [consecutiveLosses, setConsecutiveLosses] = useState(0)
  const [profitLossThreshold] = useState(-100)
  const [recentProfitLoss, setRecentProfitLoss] = useState(0)
  const [totalProfitLoss, setTotalProfitLoss] = useState(0)
  const [volatility, setVolatility] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [marketCondition, setMarketCondition] = useState<'BULLISH' | 'BEARISH' | 'NEUTRAL'>('NEUTRAL')
  const [currentPrice, setCurrentPrice] = useState(4500)
  const [priceHistory, setPriceHistory] = useState<number[]>([4500])
  const toast = useToast()

  // Strategy parameters
  const [strategyParams, setStrategyParams] = useState({
    dca: {
      interval: 5,
      amount: tradeState.amount / 10,
      lastBuy: 0,
    },
    grid: {
      upperBound: 4600,
      lowerBound: 4400,
      gridLines: 5,
      gridSpacing: 50,
    },
    momentum: {
      lookbackPeriod: 10,
      threshold: 0.5,
      trendStrength: 0,
    }
  })

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (isActive) {
        setSessionTime(prev => prev + 1)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [isActive])

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Simulate price movement and trading
  useEffect(() => {
    if (!isActive) return

    const priceInterval = setInterval(() => {
      const volatilityFactor = (Math.random() * 0.004) + 0.001 // 0.1% to 0.5% volatility
      setVolatility(volatilityFactor)
      
      const change = (Math.random() - 0.5) * volatilityFactor
      const newPrice = currentPrice * (1 + change)
      setCurrentPrice(newPrice)
      setPriceHistory(prev => [...prev.slice(-100), newPrice])
      
      // Update market condition
      if (priceHistory.length > 10) {
        const recentPrices = priceHistory.slice(-10)
        const avgPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length
        if (newPrice > avgPrice * 1.02) {
          setMarketCondition('BULLISH')
        } else if (newPrice < avgPrice * 0.98) {
          setMarketCondition('BEARISH')
        } else {
          setMarketCondition('NEUTRAL')
        }
      }

      // Execute trades based on strategy
      if (Math.random() < 0.3) { // 30% chance of trade
        const isBuy = Math.random() > 0.5
        const amount = tradeState.amount * (Math.random() * 0.2 + 0.1) // 10-30% of total amount
        const profitLoss = isBuy ? -amount * newPrice : amount * newPrice
        
        setTotalProfitLoss(prev => prev + profitLoss)
        setRecentProfitLoss(profitLoss)

        toast({
          title: `${isBuy ? 'Buy' : 'Sell'} Order Executed`,
          description: `${isBuy ? 'Bought' : 'Sold'} ${amount.toFixed(4)} ${tradeState.selectedToken} @ $${newPrice.toFixed(2)}`,
          status: isBuy ? 'success' : 'warning',
          duration: 3000,
          isClosable: true,
        })
      }
    }, 1000)

    return () => clearInterval(priceInterval)
  }, [isActive, currentPrice, priceHistory, tradeState])

  // Execute trading strategies
  useInterval(() => {
    if (!isActive || !currentPrice) return
    
    // Check for strategy change based on performance
    if (consecutiveLosses >= 3 && !isChangingStrategy) {
      setIsChangingStrategy(true)
      const newStrategy = currentStrategy === 'DCA' ? 'Grid Trading' : 
                         currentStrategy === 'Grid Trading' ? 'Momentum' : 'DCA'
      setCurrentStrategy(newStrategy)
      toast({
        title: 'Strategy Change',
        description: `Switching to ${newStrategy} due to market conditions`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      setTimeout(() => setIsChangingStrategy(false), 2000)
    }
    
    switch (currentStrategy) {
      case 'DCA':
        executeDCAStrategy()
        break
      case 'Grid Trading':
        executeGridStrategy()
        break
      case 'Momentum':
        executeMomentumStrategy()
        break
    }
  }, 2000)

  const executeDCAStrategy = () => {
    const { interval, amount, lastBuy } = strategyParams.dca
    if (sessionTime - lastBuy >= interval) {
      const buyAmount = amount * (1 + (Math.random() - 0.5) * 0.2) // Vary amount by ±10%
      executeOrder('BUY', buyAmount, currentPrice, 'DCA scheduled buy')
      setStrategyParams(prev => ({
        ...prev,
        dca: { ...prev.dca, lastBuy: sessionTime }
      }))
    }
  }

  const executeGridStrategy = () => {
    const { upperBound, lowerBound, gridSpacing } = strategyParams.grid
    const gridLevels = []
    for (let price = lowerBound; price <= upperBound; price += gridSpacing) {
      gridLevels.push(price)
    }

    const closestLevel = gridLevels.reduce((prev, curr) => 
      Math.abs(curr - currentPrice) < Math.abs(prev - currentPrice) ? curr : prev
    )

    if (currentPrice > closestLevel + gridSpacing * 0.5) {
      executeOrder('SELL', tradeState.amount * 0.1, currentPrice, 'Grid level sell')
    } else if (currentPrice < closestLevel - gridSpacing * 0.5) {
      executeOrder('BUY', tradeState.amount * 0.1, currentPrice, 'Grid level buy')
    }
  }

  const executeMomentumStrategy = () => {
    const { lookbackPeriod, threshold } = strategyParams.momentum
    if (priceHistory.length < lookbackPeriod) return

    const prices = priceHistory.slice(-lookbackPeriod)
    const returns = prices.map((price, i) => 
      i === 0 ? 0 : (price - prices[i-1]) / prices[i-1]
    )
    const momentum = returns.reduce((a, b) => a + b, 0) / lookbackPeriod

    setStrategyParams(prev => ({
      ...prev,
      momentum: { ...prev.momentum, trendStrength: momentum }
    }))

    if (momentum > threshold) {
      executeOrder('BUY', tradeState.amount * 0.2, currentPrice, 'Strong upward momentum')
    } else if (momentum < -threshold) {
      executeOrder('SELL', tradeState.amount * 0.2, currentPrice, 'Strong downward momentum')
    }
  }

  const executeOrder = (type: 'BUY' | 'SELL', amount: number, price: number, reason: string) => {
    const fees = amount * price * 0.001 // 0.1% fee
    const newTrade = {
      type,
      amount,
      price,
      timestamp: new Date(),
      fees,
      reason,
    }

    setTradeSignals(prev => [...prev, newTrade])
    const profitLoss = type === 'SELL' ? amount * price * 0.99 : -amount * price * 1.01
    setTotalProfitLoss(prev => prev + profitLoss)
    setRecentProfitLoss(profitLoss)

    if (profitLoss < 0) {
      setConsecutiveLosses(prev => prev + 1)
    } else {
      setConsecutiveLosses(0)
    }

    toast({
      title: `${type} Order Executed`,
      description: `${type === 'BUY' ? 'Bought' : 'Sold'} ${amount.toFixed(4)} ${tradeState.selectedToken} @ $${price.toFixed(2)}`,
      status: type === 'BUY' ? 'success' : 'warning',
      duration: 3000,
      isClosable: true,
    })
  }

  // Initialize and update chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: { color: 'rgba(17, 24, 39, 0.5)' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: true,
      },
    }

    chart.current = createChart(chartContainerRef.current, chartOptions)
    const candleSeries = chart.current.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    // Add strategy markers
    const markers: any[] = []
    if (tradeSignals.length > 0) {
      tradeSignals.forEach((signal) => {
        markers.push({
          time: signal.timestamp.getTime() / 1000 as Time,
          position: signal.type === 'BUY' ? 'belowBar' : 'aboveBar',
          color: signal.type === 'BUY' ? '#22c55e' : '#ef4444',
          shape: signal.type === 'BUY' ? 'arrowUp' : 'arrowDown',
          text: `${signal.type} - ${currentStrategy}`,
        })
      })
      candleSeries.setMarkers(markers)
    }

    // Add price data
    const baseTime = Math.floor(new Date().getTime() / 1000)
    const priceData: CandlestickData[] = priceHistory.map((price, index) => ({
      time: (baseTime - (priceHistory.length - index)) as Time,
      open: price * 0.998,
      high: price * 1.002,
      low: price * 0.997,
      close: price,
    }))
    candleSeries.setData(priceData)

    // Add strategy-specific indicators
    if (currentStrategy === 'DCA') {
      const dcaLine = chart.current.addLineSeries({
        color: '#3b82f6',
        lineWidth: 2,
        title: 'DCA Level',
      })
      dcaLine.setData(priceHistory.map((_, index) => ({
        time: (baseTime - (priceHistory.length - index)) as Time,
        value: strategyParams.dca.lastBuy,
      })))
    } else if (currentStrategy === 'Grid Trading') {
      const { upperBound, lowerBound, gridSpacing } = strategyParams.grid
      for (let price = lowerBound; price <= upperBound; price += gridSpacing) {
        const gridLine = chart.current.addLineSeries({
          color: 'rgba(59, 130, 246, 0.5)',
          lineWidth: 1,
          lineStyle: 2,
          title: `Grid ${price.toFixed(2)}`,
        })
        gridLine.setData(priceHistory.map((_, index) => ({
          time: (baseTime - (priceHistory.length - index)) as Time,
          value: price,
        })))
      }
    } else if (currentStrategy === 'Momentum') {
      const momentumLine = chart.current.addLineSeries({
        color: '#8b5cf6',
        lineWidth: 2,
        title: 'Momentum',
      })
      momentumLine.setData(priceHistory.map((price, index) => ({
        time: (baseTime - (priceHistory.length - index)) as Time,
        value: price * (1 + strategyParams.momentum.trendStrength),
      })))
    }

    // Resize handler
    const handleResize = () => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chart.current) {
        chart.current.remove()
      }
    }
  }, [tradeSignals, currentStrategy, priceHistory, strategyParams])

  return (
    <Box h="80vh" p={4}>
      <Grid templateColumns="1fr 300px" gap={4} h="100%">
        <GridItem>
          <VStack h="100%" spacing={4}>
            {/* Session Info */}
            <HStack w="100%" justify="space-between" bg="whiteAlpha.100" p={3} rounded="lg">
              <HStack>
                <Icon as={Clock} />
                <Text>Session Time: {formatTime(sessionTime)}</Text>
              </HStack>
              <Badge
                colorScheme={
                  marketCondition === 'BULLISH' ? 'green' :
                  marketCondition === 'BEARISH' ? 'red' : 'gray'
                }
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Icon as={marketCondition === 'BULLISH' ? TrendingUp : 
                         marketCondition === 'BEARISH' ? TrendingDown : Activity} size={14} />
                {marketCondition}
              </Badge>
            </HStack>

            {/* Chart */}
            <Box w="100%" h="calc(100% - 100px)" ref={chartContainerRef} />
          </VStack>
        </GridItem>

        {/* Trading Info */}
        <GridItem>
          <VStack spacing={4} h="100%" bg="whiteAlpha.50" p={4} rounded="lg" overflowY="auto">
            <Heading size="md">Trading Dashboard</Heading>
            
            {/* Current Price */}
            <Stat>
              <StatLabel>Current Price</StatLabel>
              <StatNumber>${currentPrice.toFixed(2)}</StatNumber>
              <StatHelpText>
                <StatArrow type={recentProfitLoss >= 0 ? 'increase' : 'decrease'} />
                {(volatility * 100).toFixed(2)}% Volatility
              </StatHelpText>
            </Stat>

            {/* Total P/L */}
            <Stat>
              <StatLabel>Total Profit/Loss</StatLabel>
              <StatNumber color={totalProfitLoss >= 0 ? 'green.400' : 'red.400'}>
                ${Math.abs(totalProfitLoss).toFixed(2)}
              </StatNumber>
              <StatHelpText>
                <StatArrow type={totalProfitLoss >= 0 ? 'increase' : 'decrease'} />
                {((totalProfitLoss / (tradeState.amount * currentPrice)) * 100).toFixed(2)}%
              </StatHelpText>
            </Stat>

            {/* Strategy Info */}
            <VStack align="stretch" w="100%" spacing={3}>
              <Heading size="sm">Active Strategy</Heading>
              <HStack bg="whiteAlpha.100" p={3} rounded="lg">
                <Icon as={
                  currentStrategy === 'DCA' ? Target :
                  currentStrategy === 'Grid Trading' ? BarChart2 : Brain
                } />
                <Text>{currentStrategy}</Text>
              </HStack>
            </VStack>

            {/* Manual Trading Controls */}
            <VStack align="stretch" w="100%" spacing={3}>
              <Heading size="sm">Manual Trading</Heading>
              <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                <Button
                  colorScheme="green"
                  leftIcon={<Icon as={TrendingUp} />}
                  onClick={() => executeOrder('BUY', tradeState.amount * 0.1, currentPrice, 'Manual buy')}
                >
                  Buy
                </Button>
                <Button
                  colorScheme="red"
                  leftIcon={<Icon as={TrendingDown} />}
                  onClick={() => executeOrder('SELL', tradeState.amount * 0.1, currentPrice, 'Manual sell')}
                >
                  Sell
                </Button>
              </Grid>
            </VStack>

            {/* Recent Trades */}
            <VStack align="stretch" w="100%" spacing={3}>
              <Heading size="sm">Recent Trades</Heading>
              <VStack 
                align="stretch" 
                spacing={2} 
                maxH="300px" 
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                  },
                }}
              >
                {tradeSignals.slice().reverse().map((trade, index) => (
                  <Box
                    key={index}
                    p={3}
                    bg="whiteAlpha.100"
                    rounded="lg"
                    borderLeft="4px solid"
                    borderColor={trade.type === 'BUY' ? 'green.400' : 'red.400'}
                  >
                    <Flex justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <Badge colorScheme={trade.type === 'BUY' ? 'green' : 'red'}>
                          {trade.type}
                        </Badge>
                        <Text fontSize="sm" color="gray.300">{trade.reason}</Text>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Text fontWeight="bold">
                          {trade.amount.toFixed(4)} {tradeState.selectedToken}
                        </Text>
                        <Text fontSize="sm" color="gray.300">
                          @ ${trade.price.toFixed(2)}
                        </Text>
                      </VStack>
                    </Flex>
                    <Flex justify="space-between" mt={2}>
                      <Text fontSize="xs" color="gray.400">
                        Fee: ${trade.fees.toFixed(2)}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {trade.timestamp.toLocaleTimeString()}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </VStack>

            {/* Strategy Parameters */}
            <VStack align="stretch" w="100%" spacing={3}>
              <Heading size="sm">Strategy Parameters</Heading>
              <Box bg="whiteAlpha.100" p={3} rounded="lg">
                {currentStrategy === 'DCA' && (
                  <VStack align="stretch" spacing={2}>
                    <Text fontSize="sm">Interval: {strategyParams.dca.interval}s</Text>
                    <Text fontSize="sm">Next Buy: {strategyParams.dca.interval - (sessionTime - strategyParams.dca.lastBuy)}s</Text>
                    <Text fontSize="sm">Amount: {strategyParams.dca.amount.toFixed(4)} {tradeState.selectedToken}</Text>
                  </VStack>
                )}
                {currentStrategy === 'Grid Trading' && (
                  <VStack align="stretch" spacing={2}>
                    <Text fontSize="sm">Upper: ${strategyParams.grid.upperBound.toFixed(2)}</Text>
                    <Text fontSize="sm">Lower: ${strategyParams.grid.lowerBound.toFixed(2)}</Text>
                    <Text fontSize="sm">Grid Size: ${strategyParams.grid.gridSpacing.toFixed(2)}</Text>
                  </VStack>
                )}
                {currentStrategy === 'Momentum' && (
                  <VStack align="stretch" spacing={2}>
                    <Text fontSize="sm">Lookback: {strategyParams.momentum.lookbackPeriod}s</Text>
                    <Text fontSize="sm">Strength: {(strategyParams.momentum.trendStrength * 100).toFixed(2)}%</Text>
                    <Text fontSize="sm">Threshold: {(strategyParams.momentum.threshold * 100).toFixed(2)}%</Text>
                  </VStack>
                )}
              </Box>
            </VStack>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default TradingView