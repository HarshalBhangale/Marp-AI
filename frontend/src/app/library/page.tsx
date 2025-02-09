'use client'

import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  HStack,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Link,
} from '@chakra-ui/react'
import {
  Book,
  Rocket,
  LineChart,
  Shield,
  Search,
  Zap,
  Network,
  Wallet,
  ArrowRight,
  BookOpen,
  Code,
  HelpCircle,
} from 'lucide-react'
import { useState } from 'react'

const LIBRARY_SECTIONS = {
  gettingStarted: {
    title: 'Getting Started',
    items: [
      {
        title: 'Introduction to Marp Trades',
        description: 'Learn about Marp Trades and its key features for automated trading on Starknet.',
        icon: Rocket,
        difficulty: 'Beginner',
        link: '/docs/intro',
      },
      {
        title: 'Setting Up Your Account',
        description: 'Step-by-step guide to configure your wallet and start trading.',
        icon: Wallet,
        difficulty: 'Beginner',
        link: '/docs/setup',
      },
      {
        title: 'Understanding Starknet',
        description: 'Overview of Starknet and its advantages for decentralized trading.',
        icon: Network,
        difficulty: 'Intermediate',
        link: '/docs/starknet',
      },
    ],
  },
  tradingStrategies: {
    title: 'Trading Strategies',
    items: [
      {
        title: 'Dollar Cost Averaging (DCA)',
        description: 'Automated strategy to reduce impact of volatility through periodic investments.',
        icon: LineChart,
        difficulty: 'Beginner',
        link: '/docs/strategies/dca',
      },
      {
        title: 'Grid Trading',
        description: 'Profit from price oscillations by placing orders at regular intervals.',
        icon: Zap,
        difficulty: 'Advanced',
        link: '/docs/strategies/grid',
      },
      {
        title: 'TWAP Strategy',
        description: 'Time-Weighted Average Price strategy for large orders with minimal price impact.',
        icon: LineChart,
        difficulty: 'Intermediate',
        link: '/docs/strategies/twap',
      },
      {
        title: 'Momentum Trading',
        description: 'Capitalize on market trends using technical indicators and AI analysis.',
        icon: LineChart,
        difficulty: 'Advanced',
        link: '/docs/strategies/momentum',
      },
    ],
  },
  technicalDocs: {
    title: 'Technical Documentation',
    items: [
      {
        title: 'API Reference',
        description: 'Complete API documentation for integrating with Marp Trades.',
        icon: Code,
        difficulty: 'Advanced',
        link: '/docs/api',
      },
      {
        title: 'Smart Contracts',
        description: 'Understanding the smart contracts powering Marp Trades on Starknet.',
        icon: Shield,
        difficulty: 'Advanced',
        link: '/docs/contracts',
      },
      {
        title: 'Risk Management',
        description: 'Learn about the risk management features and best practices.',
        icon: Shield,
        difficulty: 'Intermediate',
        link: '/docs/risk',
      },
    ],
  },
}

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  const renderSection = (section: typeof LIBRARY_SECTIONS.gettingStarted) => (
    <Box mb={8}>
      <Heading size="md" mb={4}>
        {section.title}
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {section.items
          .filter(
            (item) =>
              searchQuery === '' ||
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((item) => (
            <Card
              key={item.title}
              bg="whiteAlpha.50"
              borderWidth="1px"
              borderColor="whiteAlpha.100"
              _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
            >
              <CardBody>
                <HStack spacing={4} mb={3}>
                  <Icon as={item.icon} boxSize={5} color="blue.400" />
                  <Badge
                    colorScheme={
                      item.difficulty === 'Beginner'
                        ? 'green'
                        : item.difficulty === 'Intermediate'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {item.difficulty}
                  </Badge>
                </HStack>
                <Heading size="sm" mb={2}>
                  {item.title}
                </Heading>
                <Text color="gray.400" fontSize="sm" mb={4}>
                  {item.description}
                </Text>
                <Link
                  href={item.link}
                  color="blue.400"
                  fontSize="sm"
                  display="flex"
                  alignItems="center"
                  _hover={{ textDecoration: 'none', color: 'blue.300' }}
                >
                  Read More
                  <Icon as={ArrowRight} boxSize={4} ml={1} />
                </Link>
              </CardBody>
            </Card>
          ))}
      </SimpleGrid>
    </Box>
  )

  return (
    <Box minH="calc(100vh - 4rem)" bg="gray.900" p={8}>
      <VStack spacing={8} align="stretch" maxW="7xl" mx="auto">
        {/* Header */}
        <Box>
          <Heading mb={2}>Documentation Library</Heading>
          <Text color="gray.400">
            Comprehensive guides and documentation for Marp Trades on Starknet
          </Text>
        </Box>

        <Divider borderColor="whiteAlpha.200" />

        {/* Search */}
        <InputGroup maxW="md">
          <InputLeftElement>
            <Icon as={Search} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="whiteAlpha.50"
          />
        </InputGroup>

        {/* Content */}
        <Tabs
          variant="soft-rounded"
          colorScheme="blue"
          index={activeTab}
          onChange={setActiveTab}
        >
          <TabList mb={4}>
            <Tab>All</Tab>
            <Tab>Getting Started</Tab>
            <Tab>Strategies</Tab>
            <Tab>Technical</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              {renderSection(LIBRARY_SECTIONS.gettingStarted)}
              {renderSection(LIBRARY_SECTIONS.tradingStrategies)}
              {renderSection(LIBRARY_SECTIONS.technicalDocs)}
            </TabPanel>
            <TabPanel px={0}>{renderSection(LIBRARY_SECTIONS.gettingStarted)}</TabPanel>
            <TabPanel px={0}>{renderSection(LIBRARY_SECTIONS.tradingStrategies)}</TabPanel>
            <TabPanel px={0}>{renderSection(LIBRARY_SECTIONS.technicalDocs)}</TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  )
} 