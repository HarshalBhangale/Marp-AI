import { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'
import type { IChartApi, DeepPartial, ChartOptions, SeriesOptionsCommon } from 'lightweight-charts'
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
} from '@chakra-ui/react'
import { 
  Activity, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  ChevronDown,
  MessageCircle,
  Brain,
  TrendingDown,
  Target,
  BarChart2
} from 'lucide-react'
import { TradeState } from '@/types'
import { useKlines, useLatestPrice } from '@/services/priceService'

interface TradingViewProps {
  tradeState: TradeState
}

interface AIPrediction {
  type: 'SUPPORT' | 'RESISTANCE' | 'TREND'
  level?: number
  direction?: string
  confidence: number
  timeframe: string
}

interface NewsItem {
  source: string
  title: string
  time: string
  sentiment: 'positive' | 'negative' | 'neutral'
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandleDataFormatted {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const TradingView = ({ tradeState }: TradingViewProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chart = useRef<IChartApi | null>(null)
  const [timeframe, setTimeframe] = useState('1h')
  const { data: klineData, isLoading: isLoadingKlines } = useKlines(tradeState.selectedToken, timeframe)
  const { data: latestPrice } = useLatestPrice(tradeState.selectedToken)

  // Mock news data
  const news = [
    {
      source: 'CryptoNews',
      title: 'Market Analysis: BTC Shows Strong Momentum',
      time: '10 mins ago',
      sentiment: 'positive'
    },
    {
      source: 'Trading View',
      title: 'Technical Analysis: Support Level Holding',
      time: '25 mins ago',
      sentiment: 'neutral'
    },
    {
      source: 'Market Watch',
      title: 'Whale Alert: Large BTC Transfer Detected',
      time: '45 mins ago',
      sentiment: 'neutral'
    }
  ]

  // Mock AI predictions
  const aiPredictions = [
    {
      type: 'SUPPORT',
      level: 64500,
      confidence: 85,
      timeframe: '4h'
    },
    {
      type: 'RESISTANCE',
      level: 66800,
      confidence: 78,
      timeframe: '4h'
    },
    {
      type: 'TREND',
      direction: 'BULLISH',
      confidence: 82,
      timeframe: '1d'
    }
  ]

  useEffect(() => {
    if (chartContainerRef.current) {
      const chartOptions = {
        layout: {
          background: { color: 'transparent' },
          textColor: '#d1d5db',
        },
        grid: {
          vertLines: { color: '#2d374850' },
          horzLines: { color: '#2d374850' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          mode: 1,
        },
      }

      const newChart = createChart(chartContainerRef.current, chartOptions)
      chart.current = newChart

      const candleSeries = newChart.addCandlestickSeries()
      candleSeries.applyOptions({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      })

      if (klineData) {
        const formattedData = klineData
          .map((candle: CandleData, index: number) => ({
            time: new Date(candle.time).getTime() / 1000 + index,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          }))
          .sort((a: CandleDataFormatted, b: CandleDataFormatted) => a.time - b.time);

        candleSeries.setData(formattedData);
      }

      const handleResize = () => {
        if (chart.current && chartContainerRef.current) {
          chart.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
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
    }
  }, [klineData])

  return (
    <Box p={6} bg="gray.800" rounded="xl" shadow="xl">
      <Grid templateColumns="2fr 1fr" gap={6}>
        {/* Left Column - Chart and Trading Activity */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Chart Header */}
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="md">
                  {tradeState.selectedToken}/USD
                  {latestPrice && (
                    <Text as="span" color="gray.400" ml={2} fontSize="lg">
                      ${latestPrice.toLocaleString()}
                    </Text>
                  )}
                </Heading>
                <Text color="gray.400" fontSize="sm">Live Price Chart</Text>
              </Box>
              <HStack spacing={4}>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Button onClick={() => setTimeframe('15m')} isActive={timeframe === '15m'}>15m</Button>
                  <Button onClick={() => setTimeframe('1h')} isActive={timeframe === '1h'}>1h</Button>
                  <Button onClick={() => setTimeframe('4h')} isActive={timeframe === '4h'}>4h</Button>
                  <Button onClick={() => setTimeframe('1d')} isActive={timeframe === '1d'}>1d</Button>
                </ButtonGroup>
              </HStack>
            </Flex>

            {/* TradingView Chart */}
            <Box ref={chartContainerRef} h="400px" position="relative">
              {isLoadingKlines && (
                <Flex
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  align="center"
                  justify="center"
                  bg="blackAlpha.50"
                  backdropFilter="blur(2px)"
                >
                  <Text>Loading chart data...</Text>
                </Flex>
              )}
            </Box>

            {/* AI Predictions */}
            <Box>
              <Heading size="sm" mb={4}>
                <Flex align="center" gap={2}>
                  <Icon as={Brain} />
                  <Text>AI Predictions</Text>
                </Flex>
              </Heading>
              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                {aiPredictions.map((prediction, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg="whiteAlpha.50"
                    rounded="lg"
                    borderWidth="1px"
                    borderColor="whiteAlpha.100"
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text color="gray.400">{prediction.type}</Text>
                      <Badge colorScheme={prediction.confidence > 80 ? 'green' : 'yellow'}>
                        {prediction.confidence}%
                      </Badge>
                    </Flex>
                    <Text fontSize="lg" fontWeight="bold">
                      {prediction.type === 'TREND' ? prediction.direction : `$${prediction.level?.toLocaleString()}`}
                    </Text>
                    <Text fontSize="sm" color="gray.400">{prediction.timeframe} timeframe</Text>
                  </Box>
                ))}
              </Grid>
            </Box>

            {/* Trading Activity */}
            <Box>
              <Heading size="sm" mb={4}>
                <Flex align="center" gap={2}>
                  <Icon as={Activity} />
                  <Text>Recent Trading Activity</Text>
                </Flex>
              </Heading>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Action</Th>
                    <Th>Reason</Th>
                    <Th>Price</Th>
                    <Th>Amount</Th>
                    <Th>Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tradeState.trades.map((trade, index) => (
                    <Tr key={index}>
                      <Td>
                        <Badge colorScheme={trade.type === 'BUY' ? 'green' : 'red'}>
                          {trade.type}
                        </Badge>
                      </Td>
                      <Td>
                        <Flex align="center" gap={2}>
                          <Icon 
                            as={trade.type === 'BUY' ? TrendingUp : TrendingDown} 
                            color={trade.type === 'BUY' ? 'green.400' : 'red.400'}
                            size={14}
                          />
                          <Text fontSize="sm">
                            {trade.type === 'BUY' ? 'Support level reached' : 'Target price hit'}
                          </Text>
                        </Flex>
                      </Td>
                      <Td>${trade.price.toLocaleString()}</Td>
                      <Td>${trade.amount.toLocaleString()}</Td>
                      <Td>{trade.timestamp.toLocaleTimeString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        </GridItem>

        {/* Right Column - News, Performance, and Agent Status */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Strategy Info */}
            <Box p={4} bg="whiteAlpha.50" rounded="lg">
              <HStack spacing={4} mb={4}>
                <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                  {tradeState.strategy}
                </Badge>
                <Badge 
                  colorScheme={
                    tradeState.riskLevel === 'HIGH' ? 'red' : 
                    tradeState.riskLevel === 'MEDIUM' ? 'yellow' : 'green'
                  } 
                  px={3} 
                  py={1}
                >
                  {tradeState.riskLevel} Risk
                </Badge>
              </HStack>
              <Text color="gray.400" fontSize="sm">
                Active strategy with automated trading based on technical analysis and market sentiment
              </Text>
            </Box>

            {/* Performance Metrics */}
            <Box>
              <Heading size="sm" mb={4}>
                <Flex align="center" gap={2}>
                  <Icon as={BarChart2} />
                  <Text>Performance</Text>
                </Flex>
              </Heading>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Stat bg="whiteAlpha.50" p={3} rounded="lg">
                  <StatLabel>Total Profit/Loss</StatLabel>
                  <StatNumber color={tradeState.performance.totalProfit >= 0 ? 'green.400' : 'red.400'}>
                    ${Math.abs(tradeState.performance.totalProfit).toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type={tradeState.performance.totalProfit >= 0 ? 'increase' : 'decrease'} />
                    {tradeState.performance.roi}%
                  </StatHelpText>
                </Stat>
                <Stat bg="whiteAlpha.50" p={3} rounded="lg">
                  <StatLabel>Average Entry</StatLabel>
                  <StatNumber>${tradeState.performance.averageEntry.toLocaleString()}</StatNumber>
                </Stat>
              </Grid>
            </Box>

            {/* News Feed */}
            <Box>
              <Heading size="sm" mb={4}>
                <Flex align="center" gap={2}>
                  <Icon as={MessageCircle} />
                  <Text>Latest News & Analysis</Text>
                </Flex>
              </Heading>
              <VStack spacing={3} align="stretch">
                {news.map((item, index) => (
                  <Box
                    key={index}
                    p={3}
                    bg="whiteAlpha.50"
                    rounded="lg"
                    borderWidth="1px"
                    borderColor="whiteAlpha.100"
                  >
                    <Flex justify="space-between" align="start" mb={1}>
                      <Text fontSize="sm" fontWeight="medium">{item.source}</Text>
                      <Badge
                        colorScheme={
                          item.sentiment === 'positive' ? 'green' :
                          item.sentiment === 'negative' ? 'red' : 'gray'
                        }
                        variant="subtle"
                      >
                        {item.sentiment}
                      </Badge>
                    </Flex>
                    <Text fontSize="sm" mb={1}>{item.title}</Text>
                    <Text fontSize="xs" color="gray.400">{item.time}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Agent Status */}
            <Box>
              <Heading size="sm" mb={4}>
                <Flex align="center" gap={2}>
                  <Icon as={Brain} />
                  <Text>AI Agent Status</Text>
                </Flex>
              </Heading>
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between" bg="whiteAlpha.50" p={3} rounded="lg">
                  <Flex align="center" gap={2}>
                    <Icon as={Activity} color="green.400" />
                    <Text>Agent Status</Text>
                  </Flex>
                  <Badge colorScheme="green">Active</Badge>
                </HStack>
                <HStack justify="space-between" bg="whiteAlpha.50" p={3} rounded="lg">
                  <Flex align="center" gap={2}>
                    <Icon as={Target} color="blue.400" />
                    <Text>Next Target</Text>
                  </Flex>
                  <Text>$67,500</Text>
                </HStack>
                <HStack justify="space-between" bg="whiteAlpha.50" p={3} rounded="lg">
                  <Flex align="center" gap={2}>
                    <Icon as={AlertCircle} color="yellow.400" />
                    <Text>Risk Level</Text>
                  </Flex>
                  <Badge colorScheme="yellow">Medium</Badge>
                </HStack>
                <HStack justify="space-between" bg="whiteAlpha.50" p={3} rounded="lg">
                  <Flex align="center" gap={2}>
                    <Icon as={DollarSign} color="green.400" />
                    <Text>Available Balance</Text>
                  </Flex>
                  <Text>${(tradeState.amount * 0.7).toLocaleString()}</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default TradingView 