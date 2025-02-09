'use client'

import { Send } from 'lucide-react'
import { useState, KeyboardEvent, ChangeEvent, useEffect } from 'react'
import { Message } from '@/types'
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  Heading,
  Container,
  Icon,
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

  const bgColor = 'gray.800'
  const borderColor = 'gray.700'
  const inputBg = 'whiteAlpha.100'

  useEffect(() => {
    // Set initial message after component mounts to avoid hydration issues
    setMessages([
      {
        id: 1,
        content: 'Hello! I\'m your trading assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ])
  }, [])

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

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        content: 'I\'m analyzing your request. Please wait while I process the trading information.',
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
    <Flex direction="column" h="full">
      {/* Chat Header */}
      <Box borderBottom="1px" borderColor={borderColor} p={4}>
        <Heading size="lg">Trading Assistant</Heading>
        <Text fontSize="sm" color="gray.400">Ask me anything about trading</Text>
      </Box>

      {/* Chat Messages */}
      <VStack
        flex="1"
        overflowY="auto"
        p={4}
        align="stretch"
        gap={4}
      >
        {messages.map((message) => (
          <Flex
            key={message.id}
            justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
          >
            <Box
              maxW="70%"
              rounded="lg"
              px={4}
              py={2}
              bg={message.sender === 'user' ? 'blue.600' : bgColor}
              color="white"
            >
              <Text>{message.content}</Text>
              <Text fontSize="xs" color="gray.400" mt={1}>
                {formatTime(message.timestamp)}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>

      {/* Chat Input */}
      <Box borderTop="1px" borderColor={borderColor} p={4}>
        <Flex gap={4}>
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            bg={inputBg}
            border="1px"
            borderColor={borderColor}
            _focus={{
              outline: 'none',
              ring: 2,
              ringColor: 'blue.500',
            }}
            color="white"
            _placeholder={{ color: 'gray.400' }}
          />
          <Button
            aria-label="Send message"
            onClick={handleSend}
            colorScheme="blue"
            p={2}
          >
            <Icon as={Send} boxSize={5} />
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

export default ChatInterface 