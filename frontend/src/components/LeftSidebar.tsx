'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Library, BarChart2, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Flex,
  Icon,
  Grid,
  GridItem,
  useColorModeValue,
} from '@chakra-ui/react'

const navigation = [
  { name: 'Chat', href: '/', icon: MessageSquare },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Transactions', href: '/transactions', icon: BarChart2 },
]

const LeftSidebar = () => {
  const bgColor = 'whiteAlpha.50'
  const cardBg = 'whiteAlpha.100'

  return (
    <Box
      w="80"
      bg={bgColor}
      backdropFilter="blur(8px)"
      borderRight="1px"
      borderColor="gray.700"
      p={4}
      overflowY="auto"
    >
      <VStack spacing={6} align="stretch">
        {/* Market Overview Section */}
        <Box>
          <Heading size="lg" mb={4}>Market Overview</Heading>
          
          {/* Bitcoin Card */}
          <Box bg={cardBg} rounded="lg" p={4} mb={4}>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="medium">Bitcoin</Text>
              <Text fontSize="sm" color="gray.400">BTC</Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="bold">$48,234.21</Text>
              <Flex align="center" color="green.400">
                <Icon as={TrendingUp} boxSize={4} mr={1} />
                <Text>+2.4%</Text>
              </Flex>
            </Flex>
          </Box>

          {/* Ethereum Card */}
          <Box bg={cardBg} rounded="lg" p={4}>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="medium">Ethereum</Text>
              <Text fontSize="sm" color="gray.400">ETH</Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="bold">$2,854.12</Text>
              <Flex align="center" color="red.400">
                <Icon as={TrendingDown} boxSize={4} mr={1} />
                <Text>-0.8%</Text>
              </Flex>
            </Flex>
          </Box>
        </Box>

        {/* Quick Actions Section */}
        <Box>
          <Heading size="lg" mb={4}>Quick Actions</Heading>
          <VStack spacing={3}>
            <Button
              w="full"
              colorScheme="blue"
              fontWeight="medium"
            >
              Connect Wallet
            </Button>
            <Grid templateColumns="repeat(2, 1fr)" gap={3} w="full">
              <Button
                colorScheme="green"
                fontWeight="medium"
              >
                Buy
              </Button>
              <Button
                colorScheme="red"
                fontWeight="medium"
              >
                Sell
              </Button>
            </Grid>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default LeftSidebar 