'use client'

import { Activity, MessageCircle, Sparkles } from 'lucide-react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import useInterval from '@/hooks/useInterval'

interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

interface MemeToken {
  name: string
  symbol: string
  price: number
  priceChange: number
  volume24h: number
  chain: string
}

const LeftSidebar = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [memeTokens, setMemeTokens] = useState<MemeToken[]>([])
  const [loading, setLoading] = useState(true)

  const bgGradient = 'linear(to-b, gray.900, gray.800)'
  const cardBg = 'whiteAlpha.50'
  const borderColor = 'whiteAlpha.100'

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en'
      )
      const data = await response.json()
      setCryptoData(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      setLoading(false)
    }
  }

  // Simulated meme token data - In a real app, you'd fetch this from DEXScreener API
  const mockMemeTokens: MemeToken[] = [
    {
      name: 'PEPE',
      symbol: 'PEPE',
      price: 0.000003521,
      priceChange: 15.2,
      volume24h: 42500000,
      chain: 'ETH',
    },
    {
      name: 'Dogwifhat',
      symbol: 'WIF',
      price: 0.42156,
      priceChange: -5.8,
      volume24h: 12500000,
      chain: 'SOL',
    },
    {
      name: 'BONK',
      symbol: 'BONK',
      price: 0.00001234,
      priceChange: 8.4,
      volume24h: 15800000,
      chain: 'SOL',
    },
    {
      name: 'Meme',
      symbol: 'MEME',
      price: 0.02345,
      priceChange: -2.1,
      volume24h: 9800000,
      chain: 'ETH',
    },
    {
      name: 'Wojak',
      symbol: 'WOJAK',
      price: 0.000000789,
      priceChange: 25.6,
      volume24h: 5600000,
      chain: 'ETH',
    },
    {
      name: 'Shiba Inu',
      symbol: 'SHIB',
      price: 0.00000865,
      priceChange: 4.3,
      volume24h: 65000000,
      chain: 'ETH',
    },
    {
      name: 'Floki',
      symbol: 'FLOKI',
      price: 0.00003412,
      priceChange: 12.7,
      volume24h: 33000000,
      chain: 'BSC',
    },
    {
      name: 'Kabosu',
      symbol: 'KABOSU',
      price: 0.00000214,
      priceChange: -3.5,
      volume24h: 2200000,
      chain: 'ETH',
    },
    {
      name: 'Jeet',
      symbol: 'JEET',
      price: 0.0145,
      priceChange: -8.2,
      volume24h: 780000,
      chain: 'BSC',
    },
    {
      name: 'CorgiAI',
      symbol: 'CORGI',
      price: 0.00356,
      priceChange: 5.9,
      volume24h: 11000000,
      chain: 'SOL',
    },
    {
      name: 'HarryPotterObamaSonic10Inu',
      symbol: 'BITCOIN',
      price: 0.00231,
      priceChange: 30.5,
      volume24h: 4500000,
      chain: 'ETH',
    },
    {
      name: 'Doge',
      symbol: 'DOGE',
      price: 0.0921,
      priceChange: 1.2,
      volume24h: 89000000,
      chain: 'ETH',
    },
    {
      name: 'Toshi',
      symbol: 'TOSHI',
      price: 0.000000432,
      priceChange: 19.8,
      volume24h: 6200000,
      chain: 'SOL',
    },
    {
      name: 'BananaCat',
      symbol: 'BANANACAT',
      price: 0.0145,
      priceChange: -4.2,
      volume24h: 1500000,
      chain: 'BSC',
    },
    {
      name: 'Nyan Cat',
      symbol: 'NYAN',
      price: 0.00000298,
      priceChange: 7.6,
      volume24h: 3100000,
      chain: 'ETH',
    },
    {
      name: 'Cheems',
      symbol: 'CHEEMS',
      price: 0.00000732,
      priceChange: -1.5,
      volume24h: 7200000,
      chain: 'BSC',
    },
    {
      name: 'DogeBonk',
      symbol: 'DOGEBONK',
      price: 0.00001245,
      priceChange: 10.3,
      volume24h: 8700000,
      chain: 'ETH',
    },
    {
      name: 'Wen',
      symbol: 'WEN',
      price: 0.00000088,
      priceChange: 22.1,
      volume24h: 5400000,
      chain: 'SOL',
    },
    {
      name: 'ElonDoge',
      symbol: 'EDOGE',
      price: 0.00000587,
      priceChange: 9.5,
      volume24h: 4200000,
      chain: 'ETH',
    },
    {
      name: 'BaseDoge',
      symbol: 'BASEDOGE',
      price: 0.00000123,
      priceChange: -6.7,
      volume24h: 3150000,
      chain: 'BSC',
    }
];


  useEffect(() => {
    fetchCryptoData()
    setMemeTokens(mockMemeTokens)
  }, [])

  useInterval(() => {
    fetchCryptoData()
  }, 30000)

  const formatPrice = (price: number) => {
    if (price < 0.000001) {
      return price.toExponential(4)
    }
    if (price < 0.01) {
      return price.toFixed(6)
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(volume)
  }

  return (
    <Box
      h="100vh"
      bgGradient={bgGradient}
      p={4}
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          width: '10px',
          background: 'rgba(0, 0, 0, 0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
        },
      }}
    >
      <Tabs variant="soft-rounded" colorScheme="blue" h="full" display="flex" flexDirection="column">
        <TabList mb={4}>
          <Tab _selected={{ bg: 'blue.500' }} flex={1}>Top Tokens</Tab>
          <Tab _selected={{ bg: 'blue.500' }} flex={1}>News & Tweets</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <VStack spacing={4} align="stretch">
              <Box>
                <Flex align="center" mb={4}>
                  <Icon as={Activity} boxSize={4} color="blue.400" mr={2} />
                  <Heading size="sm">Top Cryptocurrencies</Heading>
                </Flex>

                {loading ? (
                  <VStack spacing={2}>
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} height="40px" width="100%" />
                    ))}
                  </VStack>
                ) : (
                  <Table variant="unstyled" size="sm">
                    <Thead>
                      <Tr>
                        <Th color="gray.400" pl={0}>Asset</Th>
                        <Th color="gray.400" isNumeric>Price</Th>
                        <Th color="gray.400" isNumeric pr={0}>24h</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {cryptoData.slice(0, 5).map((crypto) => (
                        <Tr
                          key={crypto.id}
                          _hover={{ bg: cardBg }}
                          transition="all 0.2s"
                        >
                          <Td pl={0}>
                            <Flex align="center" gap={2}>
                              <Box boxSize="20px">
                                <img
                                  src={crypto.image}
                                  alt={crypto.name}
                                  style={{ width: '100%', height: '100%' }}
                                />
                              </Box>
                              <Text fontSize="sm" fontWeight="medium">
                                {crypto.symbol.toUpperCase()}
                              </Text>
                            </Flex>
                          </Td>
                          <Td isNumeric>
                            <Text fontSize="sm">
                              {formatPrice(crypto.current_price)}
                            </Text>
                          </Td>
                          <Td isNumeric pr={0}>
                            <Text
                              fontSize="sm"
                              color={crypto.price_change_percentage_24h >= 0 ? 'green.400' : 'red.400'}
                            >
                              {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                              {crypto.price_change_percentage_24h.toFixed(1)}%
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>

              <Box>
                <Flex align="center" mb={4}>
                  <Icon as={Sparkles} boxSize={4} color="blue.400" mr={2} />
                  <Heading size="sm">Top Memecoins</Heading>
                </Flex>

                <Table variant="unstyled" size="sm">
                  <Thead>
                    <Tr>
                      <Th color="gray.400" pl={0}>Token</Th>
                      <Th color="gray.400" isNumeric>Price</Th>
                      <Th color="gray.400" isNumeric pr={0}>24h</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {memeTokens.map((token) => (
                      <Tr
                        key={token.symbol}
                        _hover={{ bg: cardBg }}
                        transition="all 0.2s"
                      >
                        <Td pl={0}>
                          <Flex align="center" gap={2}>
                            <Text fontSize="sm" fontWeight="medium">
                              {token.symbol}
                            </Text>
                            <Badge
                              colorScheme={token.chain === 'ETH' ? 'purple' : 'orange'}
                              variant="subtle"
                              fontSize="xs"
                            >
                              {token.chain}
                            </Badge>
                          </Flex>
                        </Td>
                        <Td isNumeric>
                          <Text fontSize="sm">
                            {formatPrice(token.price)}
                          </Text>
                        </Td>
                        <Td isNumeric pr={0}>
                          <Text
                            fontSize="sm"
                            color={token.priceChange >= 0 ? 'green.400' : 'red.400'}
                          >
                            {token.priceChange >= 0 ? '+' : ''}
                            {token.priceChange.toFixed(1)}%
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel p={0}>
            <Box>
              <Flex align="center" mb={4}>
                <Icon as={MessageCircle} boxSize={4} color="blue.400" mr={2} />
                <Heading size="sm">Latest Updates</Heading>
              </Flex>

              <VStack spacing={3} align="stretch">
                <Box
                  bg={cardBg}
                  rounded="lg"
                  p={3}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex gap={2}>
                    <Box boxSize="32px" rounded="full" overflow="hidden" flexShrink={0}>
                      <img
                        src="https://pbs.twimg.com/profile_images/1634058036934500352/b-1PGSes_400x400.jpg"
                        alt="Ethereum"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Box>
                    <Box>
                      <Flex align="center" gap={1}>
                        <Text fontSize="sm" fontWeight="bold">Ethereum</Text>
                        <Text fontSize="sm" color="gray.400">@ethereum</Text>
                      </Flex>
                      <Text fontSize="sm" mt={1}>
                        The Dencun upgrade has been activated on mainnet! 🥁
                      </Text>
                      <Text fontSize="xs" color="gray.400" mt={1}>
                        2h ago
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                <Box
                  bg={cardBg}
                  rounded="lg"
                  p={3}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex gap={2}>
                    <Box boxSize="32px" rounded="full" overflow="hidden" flexShrink={0}>
                      <img
                        src="https://pbs.twimg.com/profile_images/1743363003755573248/yqVg-wdY_400x400.jpg"
                        alt="Bitcoin"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Box>
                    <Box>
                      <Flex align="center" gap={1}>
                        <Text fontSize="sm" fontWeight="bold">Bitcoin</Text>
                        <Text fontSize="sm" color="gray.400">@bitcoin</Text>
                      </Flex>
                      <Text fontSize="sm" mt={1}>
                        Bitcoin hits new all-time high as ETF demand surges! 🚀
                      </Text>
                      <Text fontSize="xs" color="gray.400" mt={1}>
                        4h ago
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </VStack>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default LeftSidebar 