'use client'

import { Send, Bot, User } from 'lucide-react'
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
} from '@chakra-ui/react'

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const bgGradient = 'linear(to-b, gray.900, gray.800)'
  const borderColor = 'whiteAlpha.100'
  const inputBg = 'whiteAlpha.50'

  useEffect(() => {
    setMessages([
      {
        id: 1,
        content: 'Hello! I\'m your AI trading assistant. I can help you analyze market trends, execute trades, and provide real-time insights. How can I assist you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInput('')

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        content: 'I\'m analyzing your request. Please wait while I process the trading information and market data to provide you with the most accurate insights.',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <Flex direction="column" h="full" bgGradient={bgGradient}>
      {/* Chat Header */}
      <Box borderBottom="1px" borderColor={borderColor} p={6}>
        <Flex align="center" gap={3}>
          <Circle size="40px" bg="blue.500">
            <Icon as={Bot} color="white" boxSize={5} />
          </Circle>
          <Box>
            <Heading size="md">AI Trading Assistant</Heading>
            <Text fontSize="sm" color="gray.400">Powered by advanced market analysis</Text>
          </Box>
        </Flex>
      </Box>

      {/* Chat Messages */}
      <VStack
        flex="1"
        overflowY="auto"
        spacing={4}
        p={6}
        align="stretch"
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
        {messages.map((message) => (
          <Flex
            key={message.id}
            justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
          >
            <Flex
              maxW="70%"
              gap={3}
              align="start"
            >
              {message.sender === 'bot' && (
                <Circle size="32px" bg="blue.500" flexShrink={0}>
                  <Icon as={Bot} color="white" boxSize={4} />
                </Circle>
              )}
              <Box
                bg={message.sender === 'user' ? 'blue.500' : inputBg}
                color="white"
                px={4}
                py={3}
                rounded="2xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Text>{message.content}</Text>
                <Text fontSize="xs" color="whiteAlpha.700" mt={1}>
                  {formatTime(message.timestamp)}
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

      {/* Chat Input */}
      <Box borderTop="1px" borderColor={borderColor} p={6}>
        <InputGroup size="lg">
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about market trends, trading strategies, or execute trades..."
            bg={inputBg}
            border="1px"
            borderColor={borderColor}
            _focus={{
              outline: 'none',
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
            }}
            _hover={{
              borderColor: 'whiteAlpha.400',
            }}
            color="white"
            _placeholder={{ color: 'whiteAlpha.400' }}
            rounded="xl"
            pr="4.5rem"
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleSend}
              colorScheme="blue"
              rounded="lg"
              rightIcon={<Icon as={Send} boxSize={4} />}
            >
              Send
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Flex>
  )
}

export default ChatInterface 