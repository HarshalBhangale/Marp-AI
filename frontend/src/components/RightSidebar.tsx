'use client'

import { ArrowUpRight, ArrowDownRight, User } from 'lucide-react'
import {
  Box,
  VStack,
  Text,
  Flex,
  Grid,
  Icon,
  Heading,
  Circle,
} from '@chakra-ui/react'

const RightSidebar = () => {
  const bgColor = 'whiteAlpha.50'
  const cardBg = 'whiteAlpha.100'
  const statBg = 'whiteAlpha.200'

  return (
    <Box
      w="80"
      bg={bgColor}
      backdropFilter="blur(8px)"
      borderLeft="1px"
      borderColor="gray.700"
      p={4}
      overflowY="auto"
    >
      <VStack spacing={6} align="stretch">
        {/* Account Section */}
        <Box bg={cardBg} rounded="lg" p={4}>
          <Flex align="center" gap={3} mb={4}>
            <Circle size="40px" bg="gray.700">
              <Icon as={User} boxSize={6} />
            </Circle>
            <Box>
              <Text fontSize="sm" color="gray.400">Connected Wallet</Text>
              <Text fontWeight="medium">0x075e...70ea</Text>
            </Box>
          </Flex>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <Box bg={statBg} rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.400">Balance</Text>
              <Text fontWeight="bold">2.45 ETH</Text>
            </Box>
            <Box bg={statBg} rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.400">Value</Text>
              <Text fontWeight="bold">$7,012.59</Text>
            </Box>
          </Grid>
        </Box>

        {/* Transaction History */}
        <Box>
          <Heading size="lg" mb={4}>Recent Transactions</Heading>
          <VStack spacing={3} align="stretch">
            <Box bg={cardBg} rounded="lg" p={4}>
              <Flex justify="space-between" align="start" mb={2}>
                <Flex align="center">
                  <Icon as={ArrowUpRight} color="green.400" boxSize={5} mr={2} />
                  <Box>
                    <Text fontWeight="medium">Bought ETH</Text>
                    <Text fontSize="sm" color="gray.400">Today, 2:45 PM</Text>
                  </Box>
                </Flex>
                <Box textAlign="right">
                  <Text fontWeight="medium">+1.5 ETH</Text>
                  <Text fontSize="sm" color="gray.400">$4,281.75</Text>
                </Box>
              </Flex>
            </Box>

            <Box bg={cardBg} rounded="lg" p={4}>
              <Flex justify="space-between" align="start">
                <Flex align="center">
                  <Icon as={ArrowDownRight} color="red.400" boxSize={5} mr={2} />
                  <Box>
                    <Text fontWeight="medium">Sold BTC</Text>
                    <Text fontSize="sm" color="gray.400">Yesterday, 6:12 PM</Text>
                  </Box>
                </Flex>
                <Box textAlign="right">
                  <Text fontWeight="medium">-0.25 BTC</Text>
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