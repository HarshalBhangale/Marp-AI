'use client'

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  VStack,
  HStack,
  Badge,
  useToast,
} from '@chakra-ui/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const TradingSimulator = () => {
  const [investment, setInvestment] = useState(20);
  const [currentProfit, setCurrentProfit] = useState(0);
  const [trades, setTrades] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [showGraph, setShowGraph] = useState(false);
  const toast = useToast();

  const addTrade = (amount, strategy) => {
    const timestamp = new Date();
    setTrades(prev => [...prev, {
      timestamp,
      amount,
      strategy,
      runningTotal: currentProfit + amount,
      timeElapsed: 90 - timeRemaining,
      portfolioValue: investment + currentProfit + amount
    }]);
    setCurrentProfit(prev => prev + amount);
  };

  const startSimulation = () => {
    setIsRunning(true);
    setTrades([]);
    setCurrentProfit(0);
    setCurrentStrategy(1);
    setTimeRemaining(90);
    setShowGraph(false);
    
    toast({
      title: 'Simulation Started',
      description: 'Trading simulation will run for 90 seconds',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (!isRunning) return;

    // Generate random trading events throughout the 90 seconds
    const generateRandomTrades = () => {
      const numTrades = 15; // Number of trades to generate
      const trades = [];
     
      for (let i = 0; i < numTrades; i++) {
        const delay = Math.floor((90 * i) / numTrades) * 1000; // Spread trades across 90 seconds
        const profit = (Math.random() * 4 - 1).toFixed(2) * 1; // Random profit between -1 and 3
        const strategy = Math.random() > 0.5 ? 1 : 2; // Randomly switch strategies
       
        trades.push({ delay, profit, strategy });
      }
     
      return trades;
    };

    const tradeEvents = generateRandomTrades();

    // Set up trading events
    tradeEvents.forEach(({ delay, profit, strategy }) => {
      setTimeout(() => {
        setCurrentStrategy(strategy);
        addTrade(profit, strategy);
      }, delay);
    });

    // Timer countdown
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          setShowGraph(true);
          toast({
            title: 'Simulation Complete',
            description: `Final profit: $${currentProfit.toFixed(2)}`,
            status: currentProfit >= 0 ? 'success' : 'warning',
            duration: 5000,
            isClosable: true,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      setIsRunning(false);
    };
  }, [isRunning, currentProfit]);

  const formatTimeRemaining = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box p={8} maxW="7xl" mx="auto">
      <Box bg="gray.800" rounded="xl" shadow="xl" p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading size="lg" mb={2}>Trading Simulation</Heading>
            <Text color="gray.400">Initial Investment: ${investment}</Text>
          </Box>
          <HStack spacing={4}>
            {isRunning && (
              <Text fontSize="xl" fontFamily="mono" color="blue.400">
                Time: {formatTimeRemaining(timeRemaining)}
              </Text>
            )}
            <Button
              onClick={startSimulation}
              isDisabled={isRunning}
              colorScheme="blue"
              size="lg"
              leftIcon={<RefreshCcw />}
            >
              {isRunning ? 'Running...' : 'Start Simulation'}
            </Button>
          </HStack>
        </Flex>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Box>
            <VStack align="stretch" spacing={6}>
              <Box bg="whiteAlpha.50" p={4} rounded="lg">
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="lg">Current Strategy:</Text>
                  <Badge
                    colorScheme={currentStrategy === 1 ? 'green' : 'purple'}
                    px={3}
                    py={1}
                    rounded="full"
                  >
                    Strategy {currentStrategy}
                  </Badge>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text fontSize="lg">Current Profit:</Text>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={currentProfit >= 0 ? 'green.400' : 'red.400'}
                  >
                    ${currentProfit.toFixed(2)}
                  </Text>
                </Flex>
              </Box>

              {showGraph && (
                <Box bg="whiteAlpha.50" p={4} rounded="lg" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trades}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="timeElapsed"
                        label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
                        stroke="gray"
                      />
                      <YAxis
                        label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft' }}
                        stroke="gray"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1A202C',
                          border: '1px solid #2D3748',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="portfolioValue"
                        stroke="#4299E1"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </VStack>
          </Box>

          <Box bg="whiteAlpha.50" p={4} rounded="lg" maxH="400px" overflowY="auto">
            <Heading size="md" mb={4}>Trade History</Heading>
            <VStack spacing={3} align="stretch">
              {trades.map((trade, index) => (
                <Box
                  key={index}
                  bg="whiteAlpha.100"
                  p={3}
                  rounded="lg"
                  borderLeft="4px solid"
                  borderColor={trade.amount >= 0 ? 'green.400' : 'red.400'}
                >
                  <Flex justify="space-between" align="center">
                    <HStack>
                      <Icon
                        as={trade.amount >= 0 ? TrendingUp : TrendingDown}
                        color={trade.amount >= 0 ? 'green.400' : 'red.400'}
                      />
                      <Text>Strategy {trade.strategy}</Text>
                    </HStack>
                    <Text
                      fontWeight="bold"
                      color={trade.amount >= 0 ? 'green.400' : 'red.400'}
                    >
                      ${trade.amount.toFixed(2)}
                    </Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.400" mt={1}>
                    Portfolio Value: ${trade.portfolioValue.toFixed(2)}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default TradingSimulator; 