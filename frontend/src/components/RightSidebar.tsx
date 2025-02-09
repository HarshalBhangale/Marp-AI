'use client'

import { ArrowUpRight, ArrowDownRight, User, Wallet, History } from 'lucide-react'
import {
  Box,
  VStack,
  Text,
  Flex,
  Grid,
  Icon,
  Heading,
  Circle,
  Avatar,
  Divider,
  Badge,
  Skeleton,
} from '@chakra-ui/react'
import { useAccount, useBalance } from '@starknet-react/core'
import { useState, useEffect } from 'react'

const RightSidebar = () => {
  const { address } = useAccount()
  const { data: ethBalance, isLoading: isLoadingEth } = useBalance({
    address,
    token: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7' // ETH contract on Starknet
  })
  const { data: usdcBalance, isLoading: isLoadingUsdc } = useBalance({
    address,
    token: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8' // USDC contract on Starknet
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const bgGradient = 'linear(to-b, gray.900, gray.800)'
  const cardBg = 'whiteAlpha.50'
  const borderColor = 'whiteAlpha.100'

  const formatBalance = (balance: any) => {
    if (!balance) return '0'
    return (Number(balance.value) / Math.pow(10, balance.decimals)).toFixed(4)
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!mounted) return null

  return (
    <Box
      h="full"
      bgGradient={bgGradient}
      p={6}
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
      <VStack spacing={6} align="stretch">
        {/* Account Section */}
        <Box>
          <Flex align="center" mb={4}>
            <Icon as={User} boxSize={5} color="blue.400" mr={2} />
            <Heading size="md">Account</Heading>
          </Flex>
          <Box
            bg={cardBg}
            rounded="xl"
            p={4}
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
          >
            <Flex align="center" gap={3} mb={4}>
              <Avatar
                bg="blue.500"
                icon={<Icon as={Wallet} color="white" boxSize={6} />}
              />
              <Box>
                <Text fontSize="sm" color="gray.400">Connected Wallet</Text>
                <Text fontWeight="medium" fontSize="md">
                  {address ? formatAddress(address) : 'Not Connected'}
                </Text>
              </Box>
            </Flex>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box
                bg="whiteAlpha.100"
                rounded="lg"
                p={3}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Text fontSize="sm" color="gray.400">ETH Balance</Text>
                {isLoadingEth ? (
                  <Skeleton height="24px" mt={1} />
                ) : (
                  <Text fontWeight="bold" fontSize="lg">
                    {formatBalance(ethBalance)} ETH
                  </Text>
                )}
              </Box>
              <Box
                bg="whiteAlpha.100"
                rounded="lg"
                p={3}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Text fontSize="sm" color="gray.400">USDC Balance</Text>
                {isLoadingUsdc ? (
                  <Skeleton height="24px" mt={1} />
                ) : (
                  <Text fontWeight="bold" fontSize="lg">
                    {formatBalance(usdcBalance)} USDC
                  </Text>
                )}
              </Box>
            </Grid>
          </Box>
        </Box>

        <Divider borderColor={borderColor} />

        {/* Transaction History */}
        <Box>
          <Flex align="center" mb={4}>
            <Icon as={History} boxSize={5} color="blue.400" mr={2} />
            <Heading size="md">Recent Transactions</Heading>
          </Flex>
          <VStack spacing={3} align="stretch">
            {/* We can add real transaction history here later */}
            <Box
              bg={cardBg}
              rounded="xl"
              p={4}
              borderWidth="1px"
              borderColor={borderColor}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              <Flex justify="space-between" align="start" mb={2}>
                <Flex align="center">
                  <Circle size="32px" bg="green.400/10" mr={3}>
                    <Icon as={ArrowUpRight} color="green.400" boxSize={4} />
                  </Circle>
                  <Box>
                    <Flex align="center" gap={2}>
                      <Text fontWeight="medium">Bought ETH</Text>
                      <Badge colorScheme="green" variant="subtle" rounded="md">Buy</Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.400">Today, 2:45 PM</Text>
                  </Box>
                </Flex>
                <Box textAlign="right">
                  <Text fontWeight="medium" color="green.400">+1.5 ETH</Text>
                  <Text fontSize="sm" color="gray.400">$4,281.75</Text>
                </Box>
              </Flex>
            </Box>

            <Box
              bg={cardBg}
              rounded="xl"
              p={4}
              borderWidth="1px"
              borderColor={borderColor}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              <Flex justify="space-between" align="start">
                <Flex align="center">
                  <Circle size="32px" bg="red.400/10" mr={3}>
                    <Icon as={ArrowDownRight} color="red.400" boxSize={4} />
                  </Circle>
                  <Box>
                    <Flex align="center" gap={2}>
                      <Text fontWeight="medium">Sold BTC</Text>
                      <Badge colorScheme="red" variant="subtle" rounded="md">Sell</Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.400">Yesterday, 6:12 PM</Text>
                  </Box>
                </Flex>
                <Box textAlign="right">
                  <Text fontWeight="medium" color="red.400">-0.25 BTC</Text>
                  <Text fontSize="sm" color="gray.400">$12,058.55</Text>
                </Box>
              </Flex>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default RightSidebar 