'use client'

import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  HStack,
  Button,
  ButtonGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
  Circle,
} from '@chakra-ui/react'
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  MessageCircle,
  Bot,
  User as UserIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Message } from '@/types'

const MOCK_TRANSACTIONS = [
  {
    id: '0x1234...5678',
    type: 'BUY',
    asset: 'ETH',
    amount: '1.5',
    price: '3,250.00',
    total: '4,875.00',
    fee: '0.15',
    dex: 'JediSwap',
    status: 'completed',
    date: '2024-02-20 14:30:25',
  },
  {
    id: '0x8765...4321',
    type: 'SELL',
    asset: 'BTC',
    amount: '0.25',
    price: '64,000.00',
    total: '16,000.00',
    fee: '0.48',
    dex: 'Avnu',
    status: 'completed',
    date: '2024-02-20 13:15:10',
  },
  // Add more mock transactions as needed
]

const PERFORMANCE_METRICS = {
  totalTrades: 156,
  successRate: 78.5,
  avgReturnPerTrade: 2.3,
  totalVolume: '1,234,567.89',
  totalFees: '1,234.56',
  bestTrade: {
    asset: 'ETH',
    return: 15.8,
    date: '2024-02-15',
  },
}

// Add mock chat history
const MOCK_CHAT_HISTORY: Message[] = [
  {
    id: 1,
    content: "Let's start trading BTC with a DCA strategy",
    sender: 'user',
    timestamp: new Date('2024-02-20 14:25:00'),
  },
  {
    id: 2,
    content: "I'll help you set up a DCA strategy for BTC. What amount would you like to invest?",
    sender: 'bot',
    timestamp: new Date('2024-02-20 14:25:10'),
  },
  {
    id: 3,
    content: "$1000 USDC",
    sender: 'user',
    timestamp: new Date('2024-02-20 14:25:30'),
  },
  {
    id: 4,
    content: "Great! I'll set up a DCA strategy to invest $1000 USDC in BTC with weekly purchases.",
    sender: 'bot',
    timestamp: new Date('2024-02-20 14:25:45'),
  },
]

export default function Transactions() {
  const [timeframe, setTimeframe] = useState('7D')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'transactions' | 'chat'>('transactions')

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <Box minH="calc(100vh - 4rem)" bg="gray.900" p={8}>
      <VStack spacing={8} align="stretch" maxW="7xl" mx="auto">
        {/* Header */}
        <Box>
          <Heading mb={2}>History</Heading>
          <Text color="gray.400">
            View your trading activity and chat history on Starknet
          </Text>
        </Box>

        <Divider borderColor="whiteAlpha.200" />

        {/* Tab Selection */}
        <ButtonGroup size="md" isAttached variant="outline">
          <Button
            isActive={activeTab === 'transactions'}
            onClick={() => setActiveTab('transactions')}
            leftIcon={<Icon as={Activity} size={16} />}
          >
            Transactions
          </Button>
          <Button
            isActive={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            leftIcon={<Icon as={MessageCircle} size={16} />}
          >
            Chat History
          </Button>
        </ButtonGroup>

        {activeTab === 'transactions' ? (
          <>
            {/* Performance Metrics */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
              <Box bg="whiteAlpha.50" p={4} rounded="lg" borderWidth="1px" borderColor="whiteAlpha.100">
                <VStack align="start" spacing={4}>
                  <Heading size="sm">Trading Performance</Heading>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                    <Stat size="sm">
                      <StatLabel>Success Rate</StatLabel>
                      <StatNumber>{PERFORMANCE_METRICS.successRate}%</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        {PERFORMANCE_METRICS.totalTrades} trades
                      </StatHelpText>
                    </Stat>
                    <Stat size="sm">
                      <StatLabel>Avg. Return/Trade</StatLabel>
                      <StatNumber>{PERFORMANCE_METRICS.avgReturnPerTrade}%</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        Last 30 days
                      </StatHelpText>
                    </Stat>
                  </Grid>
                </VStack>
              </Box>

              <Box bg="whiteAlpha.50" p={4} rounded="lg" borderWidth="1px" borderColor="whiteAlpha.100">
                <VStack align="start" spacing={4}>
                  <Heading size="sm">Volume & Fees</Heading>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                    <Stat size="sm">
                      <StatLabel>Total Volume</StatLabel>
                      <StatNumber>${PERFORMANCE_METRICS.totalVolume}</StatNumber>
                      <StatHelpText>On Starknet</StatHelpText>
                    </Stat>
                    <Stat size="sm">
                      <StatLabel>Total Fees</StatLabel>
                      <StatNumber>${PERFORMANCE_METRICS.totalFees}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="decrease" />
                        Low Starknet fees
                      </StatHelpText>
                    </Stat>
                  </Grid>
                </VStack>
              </Box>

              <Box bg="whiteAlpha.50" p={4} rounded="lg" borderWidth="1px" borderColor="whiteAlpha.100">
                <VStack align="start" spacing={4}>
                  <Heading size="sm">Best Performance</Heading>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                    <Stat size="sm">
                      <StatLabel>Best Trade</StatLabel>
                      <StatNumber>{PERFORMANCE_METRICS.bestTrade.asset}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        {PERFORMANCE_METRICS.bestTrade.return}% return
                      </StatHelpText>
                    </Stat>
                    <Stat size="sm">
                      <StatLabel>Date</StatLabel>
                      <StatNumber fontSize="md">{PERFORMANCE_METRICS.bestTrade.date}</StatNumber>
                      <StatHelpText>Best day trading</StatHelpText>
                    </Stat>
                  </Grid>
                </VStack>
              </Box>
            </Grid>

            {/* Filters */}
            <Flex gap={4} wrap="wrap">
              <ButtonGroup size="sm" isAttached variant="outline">
                <Button isActive={timeframe === '24H'} onClick={() => setTimeframe('24H')}>24H</Button>
                <Button isActive={timeframe === '7D'} onClick={() => setTimeframe('7D')}>7D</Button>
                <Button isActive={timeframe === '30D'} onClick={() => setTimeframe('30D')}>30D</Button>
                <Button isActive={timeframe === 'ALL'} onClick={() => setTimeframe('ALL')}>ALL</Button>
              </ButtonGroup>

              <InputGroup maxW="300px" size="sm">
                <InputLeftElement>
                  <Icon as={Search} size={14} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg="whiteAlpha.50"
                />
              </InputGroup>

              <Select
                size="sm"
                maxW="200px"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                bg="whiteAlpha.50"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </Select>

              <Button
                size="sm"
                leftIcon={<Icon as={Download} size={14} />}
                ml="auto"
                colorScheme="blue"
              >
                Export
              </Button>
            </Flex>

            {/* Transactions Table */}
            <Box bg="whiteAlpha.50" rounded="lg" overflow="hidden">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Transaction ID</Th>
                    <Th>Type</Th>
                    <Th>Asset</Th>
                    <Th isNumeric>Amount</Th>
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Total</Th>
                    <Th>DEX</Th>
                    <Th>Status</Th>
                    <Th>Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {MOCK_TRANSACTIONS.map((tx) => (
                    <Tr key={tx.id}>
                      <Td fontSize="xs" fontFamily="mono">
                        {tx.id}
                      </Td>
                      <Td>
                        <HStack>
                          <Icon
                            as={tx.type === 'BUY' ? ArrowUpRight : ArrowDownRight}
                            color={tx.type === 'BUY' ? 'green.400' : 'red.400'}
                            size={14}
                          />
                          <Badge
                            colorScheme={tx.type === 'BUY' ? 'green' : 'red'}
                            variant="subtle"
                          >
                            {tx.type}
                          </Badge>
                        </HStack>
                      </Td>
                      <Td>{tx.asset}</Td>
                      <Td isNumeric>{tx.amount}</Td>
                      <Td isNumeric>${tx.price}</Td>
                      <Td isNumeric>${tx.total}</Td>
                      <Td>{tx.dex}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            tx.status === 'completed' ? 'green' :
                            tx.status === 'pending' ? 'yellow' : 'red'
                          }
                        >
                          {tx.status}
                        </Badge>
                      </Td>
                      <Td fontSize="xs">{tx.date}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </>
        ) : (
          <Box bg="whiteAlpha.50" rounded="lg" p={6}>
            <VStack spacing={4} align="stretch">
              {MOCK_CHAT_HISTORY.map((message) => (
                <Flex
                  key={message.id}
                  justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                >
                  <Flex
                    maxW="70%"
                    gap={2}
                    align="start"
                  >
                    {message.sender === 'bot' && (
                      <Circle size="32px" bg="blue.500" flexShrink={0}>
                        <Icon as={Bot} color="white" boxSize={4} />
                      </Circle>
                    )}
                    <Box
                      bg={message.sender === 'user' ? 'blue.500' : 'whiteAlpha.100'}
                      color="white"
                      px={4}
                      py={2}
                      rounded="lg"
                    >
                      <Text>{message.content}</Text>
                      <Text fontSize="xs" color="whiteAlpha.600" mt={1}>
                        {formatTime(message.timestamp)}
                      </Text>
                    </Box>
                    {message.sender === 'user' && (
                      <Circle size="32px" bg="gray.700" flexShrink={0}>
                        <Icon as={UserIcon} color="white" boxSize={4} />
                      </Circle>
                    )}
                  </Flex>
                </Flex>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  )
} 