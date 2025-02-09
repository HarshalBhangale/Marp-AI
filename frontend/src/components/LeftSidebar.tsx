'use client'

import { Activity, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from '@chakra-ui/react'

const LeftSidebar = () => {
  const bgGradient = 'linear(to-b, gray.900, gray.800)'
  const cardBg = 'whiteAlpha.50'
  const borderColor = 'whiteAlpha.100'

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
        {/* Market Overview Section */}
        <Box>
          <Flex align="center" mb={4}>
            <Icon as={Activity} boxSize={5} color="blue.400" mr={2} />
            <Heading size="md">Market Overview</Heading>
          </Flex>
          
          {/* Bitcoin Card */}
          <Box
            bg={cardBg}
            rounded="xl"
            p={4}
            mb={4}
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
          >
            <Stat>
              <Flex justify="space-between" align="center" mb={2}>
                <StatLabel fontSize="lg" fontWeight="medium">Bitcoin</StatLabel>
                <Text fontSize="sm" color="gray.400">BTC</Text>
              </Flex>
              <StatNumber fontSize="2xl" fontWeight="bold">$48,234.21</StatNumber>
              <StatHelpText mb={0}>
                <StatArrow type="increase" />
                2.4% (24h)
              </StatHelpText>
            </Stat>
          </Box>

          {/* Ethereum Card */}
          <Box
            bg={cardBg}
            rounded="xl"
            p={4}
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
          >
            <Stat>
              <Flex justify="space-between" align="center" mb={2}>
                <StatLabel fontSize="lg" fontWeight="medium">Ethereum</StatLabel>
                <Text fontSize="sm" color="gray.400">ETH</Text>
              </Flex>
              <StatNumber fontSize="2xl" fontWeight="bold">$2,854.12</StatNumber>
              <StatHelpText mb={0}>
                <StatArrow type="decrease" />
                0.8% (24h)
              </StatHelpText>
            </Stat>
          </Box>
        </Box>
      </VStack>
    </Box>
  )
}

export default LeftSidebar 