'use client'

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Flex,
  Icon,
  Circle,
  InputGroup,
  InputRightElement,
  useToast,
  Heading,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { Bot, Send, User, Brain, Search } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Knowledge base about Marp Trades
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
  ]
};

const KnowledgePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add initial welcome message
    setMessages([
      {
        id: 1,
        content: "Hello! I'm your Marp Trades knowledge assistant. I can help you understand our platform, trading strategies, and answer any questions about trading on Starknet. What would you like to know?",
        sender: 'assistant',
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: MARP_KNOWLEDGE
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: messages.length + 2,
        content: data.response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from the assistant',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box minH="calc(100vh - 4rem)" bg="gray.900" p={8}>
      <VStack spacing={8} align="stretch" maxW="3xl" mx="auto">
        {/* Header */}
        <Box>
          <Flex align="center" gap={3} mb={2}>
            <Circle size="40px" bg="blue.500">
              <Icon as={Brain} color="white" boxSize={5} />
            </Circle>
            <Box>
              <Heading size="lg">Knowledge Base</Heading>
              <Text color="gray.400">Ask anything about Marp Trades and trading on Starknet</Text>
            </Box>
          </Flex>
        </Box>

        <Divider borderColor="whiteAlpha.200" />

        {/* Chat Area */}
        <Box
          bg="whiteAlpha.50"
          rounded="xl"
          p={6}
          flex="1"
          minH="60vh"
          maxH="60vh"
          overflowY="auto"
          position="relative"
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
          <VStack spacing={4} align="stretch">
            {messages.map((message) => (
              <Flex
                key={message.id}
                justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Flex
                  maxW="70%"
                  gap={2}
                  align="start"
                >
                  {message.sender === 'assistant' && (
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
                    <Text whiteSpace="pre-wrap">{message.content}</Text>
                    <Text fontSize="xs" color="whiteAlpha.600" mt={1}>
                      {message.timestamp.toLocaleTimeString()}
                    </Text>
                  </Box>
                  {message.sender === 'user' && (
                    <Circle size="32px" bg="gray.700" flexShrink={0}>
                      <Icon as={User} color="white" boxSize={4} />
                    </Circle>
                  )}
                </Flex>
              </Flex>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        {/* Input Area */}
        <Box>
          <InputGroup size="lg">
            <Input
              placeholder="Ask about Marp Trades, trading strategies, or technical details..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.200"
              _hover={{ borderColor: 'whiteAlpha.300' }}
              _focus={{ 
                borderColor: 'blue.400',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
              }}
              pr="4.5rem"
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleSend}
                isLoading={isLoading}
                colorScheme="blue"
              >
                <Icon as={Send} size={16} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </VStack>
    </Box>
  );
};

export default KnowledgePage; 