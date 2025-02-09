'use client'

import { Send, Bot, User, ChevronDown, DollarSign, LineChart, Settings, Twitter, Github } from 'lucide-react'
import { useState, KeyboardEvent, ChangeEvent, useEffect, useRef } from 'react'
import { Message } from '@/types'
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  Heading,
  Icon,
  Circle,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Collapse,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
} from '@chakra-ui/react'
import TradingView from './TradingView'

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

interface TradeState {
  selectedToken: string;
  strategy: string;
  riskLevel: string;
  amount: number;
  isChartExpanded: boolean;
  trades: TradingActivity[];
  performance: TradePerformance;
}

interface TradingActivity {
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  timestamp: Date;
  fees: number;
}

interface TradePerformance {
  averageEntry: number;
  totalProfit: number;
  totalFees: number;
  roi: number;
}

const MARP_TRADES_KNOWLEDGE = {
  tradingStrategies: {
    'DCA': {
      name: 'Dollar Cost Averaging (DCA)',
      description: 'Automated strategy that buys a fixed amount at regular intervals on Starknet, reducing impact of volatility.',
      riskLevel: 'LOW',
      features: ['Regular interval purchases', 'Reduced emotional trading', 'Long-term accumulation']
    },
    'GRID': {
      name: 'Grid Trading',
      description: 'Places multiple buy and sell orders at regular intervals above and below the current market price on Starknet DEXes.',
      riskLevel: 'MEDIUM',
      features: ['Profit from sideways markets', 'Automated rebalancing', 'Works best in ranging markets']
    },
    'TWAP': {
      name: 'Time Weighted Average Price',
      description: 'Executes trades over specified time periods on Starknet to achieve the average market price.',
      riskLevel: 'LOW',
      features: ['Reduced slippage', 'Minimized market impact', 'Best for large orders']
    },
    'MOMENTUM': {
      name: 'Momentum Trading',
      description: 'Uses technical indicators and AI predictions to identify trends on Starknet markets.',
      riskLevel: 'HIGH',
      features: ['Trend following', 'AI-powered signals', 'Dynamic position sizing']
    }
  },
  features: {
    'StarknetIntegration': 'Direct integration with Starknet for low-cost, secure trading',
    'AIAnalysis': 'Advanced market analysis using machine learning models',
    'RiskManagement': 'Automated position sizing and risk control based on account size',
    'AutomatedTrading': 'Fully automated trade execution with customizable parameters'
  },
  supportedDEXs: [
    'JediSwap',
    'MySwap',
    '10kSwap',
    'Avnu',
    'SithSwap'
  ],
  tradingPairs: [
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'DAI', name: 'Dai' },
    { symbol: 'LORDS', name: 'Lords' },
    { symbol: 'STRK', name: 'Starknet Token' }
  ]
};

// Add knowledge base about Marp Trades
const MARP_KNOWLEDGE = {
  platform: {
    name: 'Marp Trades',
    description: 'Advanced trading platform on Starknet with AI-powered analysis',
    features: [
      'Low-cost trading on Starknet',
      'AI-powered market analysis',
      'Multiple trading strategies',
      'Real-time market data',
      'Automated trading execution'
    ]
  },
  tradingStrategies: {
    DCA: {
      name: 'Dollar Cost Averaging',
      description: 'Automated strategy that buys at regular intervals to reduce volatility impact',
      riskLevel: 'Low'
    },
    GRID: {
      name: 'Grid Trading',
      description: 'Places multiple orders at different price levels to profit from price oscillations',
      riskLevel: 'Medium'
    },
    MOMENTUM: {
      name: 'Momentum Trading',
      description: 'Uses technical indicators and AI predictions to follow market trends',
      riskLevel: 'High'
    }
  },
  supportedDEXs: [
    'JediSwap',
    'MySwap',
    '10kSwap',
    'Avnu',
    'SithSwap'
  ],
  tradingCommands: {
    trade: 'Start trading with a specific strategy',
    swap: 'Swap tokens on supported DEXs',
    info: 'Get information about trading pairs or platform features',
    help: 'List all available commands'
  },
  owners: [
    {
      name: 'Harshal Buddh',
      role: 'Frontned lead',
      image: '/assets/harshal.png',
      description: 'Co-founder of Tribeviz (2022). Previously led development at Ordex.io, Ajna.capital, and toradle.com. Creator of Angrypets.io. Experienced blockchain entrepreneur with multiple successful projects.',
      expertise: ['DeFi Architecture', 'NFTs', 'Smart Contracts', 'Project Leadership'],
      social: {
        twitter: '@harshalmarp',
        github: 'buddyharshal'
      }
    },
    {
      name: 'Prateush Sharma',
      role: 'Blockchain Lead',
      image: '/assets/pratyush.jpg',
      description: 'BTech 3rd year Computer Science and Engineering student at IIT Dhanbad. Blockchain Researcher and Developer with experience at AuctionX. Specializes in blockchain architecture and smart contract development.',
      expertise: ['Blockchain Research', 'Smart Contracts', 'DeFi Protocols'],
      social: {
        twitter: '@prateush',
        github: 'prateush'
      }
    },
    {
      name: 'Mihir',
      role: 'ML & AI Lead',
      image: '/assets/mihir.jpg',
      description: 'BTech 3rd year Computer Science and Engineering student at IIT Dhanbad. Upcoming intern at Samsung. Specializes in machine learning and AI integration for trading systems.',
      expertise: ['Machine Learning', 'AI Trading', 'Data Analysis'],
      social: {
        twitter: '@mihir_ai',
        github: 'mihir'
      }
    }
  ]
};

const TeamView = ({ owners }: { owners: typeof MARP_KNOWLEDGE.owners }) => (
  <Grid templateColumns="repeat(3, 1fr)" gap={6} p={4} bg="whiteAlpha.50" rounded="xl">
    {owners.map((owner, index) => (
      <GridItem key={index}>
        <Box bg="whiteAlpha.100" p={4} rounded="lg" height="100%">
          <VStack spacing={4} align="center">
            <Box
              width="150px"
              height="150px"
              rounded="full"
              overflow="hidden"
              border="3px solid"
              borderColor="blue.400"
            >
              <img
                src={owner.image}
                alt={owner.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
            <VStack spacing={1} textAlign="center">
              <Heading size="md" color="white">{owner.name}</Heading>
              <Text color="blue.400" fontWeight="bold" fontSize="sm">{owner.role}</Text>
              <Text color="gray.300" fontSize="sm" mt={2}>{owner.description}</Text>
              <Flex gap={2} mt={2} flexWrap="wrap" justify="center">
                {owner.expertise.map((skill, i) => (
                  <Badge key={i} colorScheme="blue" variant="subtle" fontSize="xs">
                    {skill}
                  </Badge>
                ))}
              </Flex>
              <Flex gap={3} mt={3}>
                <Link href={`https://twitter.com/${owner.social.twitter.slice(1)}`} isExternal>
                  <Icon as={Twitter} color="blue.400" boxSize={5} />
                </Link>
                <Link href={`https://github.com/${owner.social.github}`} isExternal>
                  <Icon as={Github} color="blue.400" boxSize={5} />
                </Link>
              </Flex>
            </VStack>
          </VStack>
        </Box>
      </GridItem>
    ))}
  </Grid>
);

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [tradeState, setTradeState] = useState<TradeState>({
    selectedToken: '',
    strategy: '',
    riskLevel: '',
    amount: 0,
    isChartExpanded: false,
    trades: [],
    performance: {
      averageEntry: 0,
      totalProfit: 0,
      totalFees: 0,
      roi: 0,
    }
  })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const bgGradient = 'linear(to-b, gray.900, gray.800)'
  const borderColor = 'whiteAlpha.100'
  const inputBg = 'whiteAlpha.50'

  useEffect(() => {
    setMessages([
      {
        id: 1,
        content: "Hello! I'm your Marp Trades assistant. I can help you with:\n\n" +
                "• Trading on Starknet (type 'trade' to start)\n" +
                "• Token swaps (e.g., 'swap 0.1 ETH to USDC')\n" +
                "• Information about our platform and features\n" +
                "• Trading strategies and market analysis\n\n" +
                "What would you like to do?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleTradeCommand = () => {
    const tokenList = MARP_TRADES_KNOWLEDGE.tradingPairs
      .map(token => `${token.symbol} - ${token.name}`)
      .join('\n');

    const botResponse: Message = {
      id: messages.length + 2,
      content: `Please select a token to trade on Starknet:\n\n${tokenList}\n\nJust type the symbol (e.g., "ETH") to select.`,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botResponse])
  }

  const handleTokenSelection = (token: string) => {
    setTradeState(prev => ({ ...prev, selectedToken: token }))
    
    const strategies = Object.values(MARP_TRADES_KNOWLEDGE.tradingStrategies)
      .map((strategy, index) => 
        `${index + 1}. ${strategy.name}\n   ${strategy.description}\n   Risk Level: ${strategy.riskLevel}`
      );

    const botResponse: Message = {
      id: messages.length + 2,
      content: `You've selected ${token} for trading on Starknet.\n\nPlease choose a trading strategy:\n\n${strategies.join('\n\n')}\n\nType the number (1-4) to select.`,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botResponse])
  }

  const handleStrategySelection = (strategyNumber: number) => {
    const strategies = Object.values(MARP_TRADES_KNOWLEDGE.tradingStrategies);
    const strategy = strategies[strategyNumber - 1].name;
    setTradeState(prev => ({ ...prev, strategy }))

    const botResponse: Message = {
      id: messages.length + 2,
      content: `Strategy selected: ${strategy}\n\nPlease specify your risk level for Starknet trading (Low/Medium/High):\n\nLOW - Conservative position sizing, tight stop losses\nMEDIUM - Balanced approach with moderate leverage\nHIGH - Aggressive position sizing, wider stops`,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botResponse])
  }

  const handleRiskLevel = (risk: string) => {
    setTradeState(prev => ({ ...prev, riskLevel: risk }))

    const botResponse: Message = {
      id: messages.length + 2,
      content: `Risk level set to ${risk}. How much would you like to invest in USDC? This will be used to calculate position sizes on Starknet.`,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botResponse])
  }

  const handleAmount = (amount: number) => {
    setTradeState(prev => ({ 
      ...prev, 
      amount,
      isChartExpanded: true,
      trades: [
        {
          type: 'BUY',
          price: 65000,
          amount: amount * 0.3,
          timestamp: new Date(),
          fees: amount * 0.0001, // Lower fees on Starknet
        },
        {
          type: 'BUY',
          price: 64000,
          amount: amount * 0.4,
          timestamp: new Date(Date.now() - 3600000),
          fees: amount * 0.0001,
        },
        {
          type: 'SELL',
          price: 66000,
          amount: amount * 0.2,
          timestamp: new Date(Date.now() - 7200000),
          fees: amount * 0.0001,
        },
      ],
      performance: {
        averageEntry: 64500,
        totalProfit: amount * 0.05,
        totalFees: amount * 0.0003, // Accumulated Starknet fees
        roi: 5,
      }
    }))

    const botResponse: Message = {
      id: messages.length + 2,
      content: `Perfect! I've initiated the Starknet trading strategy with $${amount} USDC. I'll now show you the trading dashboard with real-time updates from Starknet DEXs. Your trades will be executed with minimal fees and maximum security.`,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botResponse])
    onOpen()
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Check if input is a trading command
    const lowerInput = input.toLowerCase();
    if (lowerInput === 'trade') {
      handleTradeCommand();
    } else if (lowerInput.startsWith('swap')) {
      handleSwapCommand(input);
    } else {
      // If not a trading command, treat as a knowledge base query
      await handleKnowledgeQuery(input);
    }
  };

  const handleSwapCommand = (input: string) => {
    // Extract tokens from swap command (e.g., "swap 0.1 ETH to USDC")
    const parts = input.split(' ');
    if (parts.length !== 5 || parts[3].toLowerCase() !== 'to') {
      const helpMessage: Message = {
        id: messages.length + 2,
        content: 'Please use the format: swap [amount] [fromToken] to [toToken]\nExample: swap 0.1 ETH to USDC',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, helpMessage]);
      return;
    }

    const [_, amount, fromToken, __, toToken] = parts;
    const botResponse: Message = {
      id: messages.length + 2,
      content: `Preparing to swap ${amount} ${fromToken} to ${toToken} using the best available rate across our supported DEXs:\n\n` +
               `• JediSwap\n• MySwap\n• 10kSwap\n• Avnu\n• SithSwap\n\n` +
               `Please confirm by typing 'confirm swap' or 'cancel'`,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botResponse]);
  };

  const handleKnowledgeQuery = async (query: string) => {
    try {
      // Check if the query is about owners
      const isOwnerQuery = query.toLowerCase().includes('owner') || 
                          query.toLowerCase().includes('team') ||
                          query.toLowerCase().includes('founder');

      if (isOwnerQuery) {
        const teamViewResponse = `<team-view>\n\nMeet the founders of Marp Trades - a team of blockchain veterans, DeFi experts, and trading specialists who are revolutionizing decentralized trading on Starknet.`;
        
        const botResponse: Message = {
          id: messages.length + 2,
          content: teamViewResponse,
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          context: MARP_KNOWLEDGE
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botResponse: Message = {
        id: messages.length + 2,
        content: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        content: "I apologize, but I'm having trouble processing your request at the moment. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <Flex direction="column" h="calc(100vh - 4rem)" position="relative" overflow="hidden" bg="gray.900">
      {/* Chat Header */}
      <Box borderBottom="1px" borderColor={borderColor} py={3} px={4} bg="gray.800">
        <Flex align="center" gap={2}>
          <Circle size="32px" bg="blue.500">
            <Icon as={Bot} color="white" boxSize={4} />
          </Circle>
          <Box>
            <Heading size="sm">Marp Trades</Heading>
            <Text fontSize="xs" color="gray.400">Powered by advanced market analysis</Text>
          </Box>
        </Flex>
      </Box>

      {/* Trading Dashboard */}
      <Collapse in={tradeState.isChartExpanded} animateOpacity>
        <Box borderBottom="1px" borderColor={borderColor} bg="gray.800">
          <Grid templateColumns="repeat(4, 1fr)" gap={4} p={4}>
            <Stat bg="whiteAlpha.50" p={2} rounded="md" size="sm">
              <StatLabel fontSize="xs">Average Entry</StatLabel>
              <StatNumber fontSize="md">${tradeState.performance.averageEntry.toLocaleString()}</StatNumber>
            </Stat>
            <Stat bg="whiteAlpha.50" p={2} rounded="md" size="sm">
              <StatLabel fontSize="xs">Total Profit/Loss</StatLabel>
              <StatNumber fontSize="md" color={tradeState.performance.totalProfit >= 0 ? 'green.400' : 'red.400'}>
                ${Math.abs(tradeState.performance.totalProfit).toLocaleString()}
              </StatNumber>
              <StatHelpText fontSize="xs" mb={0}>
                <StatArrow type={tradeState.performance.totalProfit >= 0 ? 'increase' : 'decrease'} />
                {tradeState.performance.roi}%
              </StatHelpText>
            </Stat>
            <Stat bg="whiteAlpha.50" p={2} rounded="md" size="sm">
              <StatLabel fontSize="xs">Total Fees</StatLabel>
              <StatNumber fontSize="md">${tradeState.performance.totalFees.toLocaleString()}</StatNumber>
            </Stat>
            <Stat bg="whiteAlpha.50" p={2} rounded="md" size="sm">
              <StatLabel fontSize="xs">Active Strategy</StatLabel>
              <StatNumber fontSize="md">{tradeState.strategy || 'None'}</StatNumber>
            </Stat>
          </Grid>

          <Box px={4} pb={4}>
            <Heading size="xs" mb={2}>Recent Trading Activity</Heading>
            <Box bg="whiteAlpha.50" rounded="md" overflow="hidden">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th fontSize="xs" py={2}>Type</Th>
                    <Th fontSize="xs" py={2}>Price</Th>
                    <Th fontSize="xs" py={2}>Amount</Th>
                    <Th fontSize="xs" py={2}>Time</Th>
                    <Th fontSize="xs" py={2}>Fees</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tradeState.trades.map((trade, index) => (
                    <Tr key={index}>
                      <Td py={2}>
                        <Badge colorScheme={trade.type === 'BUY' ? 'green' : 'red'} fontSize="xs">
                          {trade.type}
                        </Badge>
                      </Td>
                      <Td py={2} fontSize="xs">${trade.price.toLocaleString()}</Td>
                      <Td py={2} fontSize="xs">${trade.amount.toLocaleString()}</Td>
                      <Td py={2} fontSize="xs">{trade.timestamp.toLocaleTimeString()}</Td>
                      <Td py={2} fontSize="xs">${trade.fees.toLocaleString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Chat Messages */}
      <Box
        flex="1"
        overflowY="auto"
        px={4}
        pt={2}
        pb="80px"
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
        <VStack spacing={3} align="stretch">
          {messages.map((message) => (
            <Flex
              key={message.id}
              justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
            >
              <Flex
                maxW={message.content.includes('<team-view>') ? '100%' : '70%'}
                gap={2}
                align="start"
              >
                {message.sender === 'bot' && (
                  <Circle size="28px" bg="blue.500" flexShrink={0}>
                    <Icon as={Bot} color="white" boxSize={3} />
                  </Circle>
                )}
                <Box
                  bg={message.sender === 'user' ? 'blue.500' : 'whiteAlpha.100'}
                  color="white"
                  px={3}
                  py={2}
                  rounded="lg"
                  fontSize="sm"
                  width={message.content.includes('<team-view>') ? '100%' : 'auto'}
                >
                  {message.content.includes('<team-view>') ? (
                    <>
                      <Text whiteSpace="pre-line" mb={4}>
                        {message.content.split('<team-view>')[1]}
                      </Text>
                      <TeamView owners={MARP_KNOWLEDGE.owners} />
                    </>
                  ) : (
                    <Text whiteSpace="pre-line">{message.content}</Text>
                  )}
                  <Text fontSize="xs" color="whiteAlpha.600" mt={1}>
                    {formatTime(message.timestamp)}
                  </Text>
                </Box>
                {message.sender === 'user' && (
                  <Circle size="28px" bg="gray.700" flexShrink={0}>
                    <Icon as={User} color="white" boxSize={3} />
                  </Circle>
                )}
              </Flex>
            </Flex>
          ))}
        </VStack>
        <div ref={messagesEndRef} />
      </Box>

      {/* Chat Input - Fixed at bottom */}
      <Box 
        position="absolute" 
        bottom={0} 
        left={0} 
        right={0}
        p={4}
        bg="gray.800"
        borderTop="1px"
        borderColor={borderColor}
        backdropFilter="blur(8px)"
        zIndex={100}
      >
        <InputGroup size="md">
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type 'trade' to start trading or ask me anything..."
            bg="gray.700"
            border="1px"
            borderColor="gray.600"
            _focus={{
              outline: 'none',
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
            }}
            _hover={{
              borderColor: 'gray.500',
            }}
            color="white"
            _placeholder={{ color: 'gray.400' }}
            rounded="md"
            pr="4.5rem"
            fontSize="sm"
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleSend}
              colorScheme="blue"
              rounded="md"
              fontSize="sm"
            >
              Send
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>

      {/* Trading View Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="gray.900" maxW="90vw" maxH="90vh" overflow="hidden">
          <ModalHeader p={0}>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody p={0}>
            <TradingView tradeState={tradeState} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default ChatInterface 