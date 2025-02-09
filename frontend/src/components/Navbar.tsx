'use client'

import NextLink from 'next/link';
import {
  Box,
  Flex,
  Button,
  Container,
  Text,
  HStack,
  Link,
} from '@chakra-ui/react';

const Navbar = () => {
  const bgColor = 'whiteAlpha.200'

  return (
    <Box
      as="nav"
      position="fixed"
      w="full"
      zIndex={50}
      bg={bgColor}
      backdropFilter="blur(8px)"
      borderBottom="1px"
      borderColor="gray.700"
    >
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <Flex h="16" alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
              <Text fontSize="xl" fontWeight="bold" color="white">
                Trading Bot
              </Text>
            </Link>
          </Flex>

          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Link
              as={NextLink}
              href="/"
              px={3}
              py={2}
              rounded="md"
              fontSize="sm"
              fontWeight="medium"
              color="gray.300"
              _hover={{ color: 'white', textDecoration: 'none' }}
            >
              Home
            </Link>
            <Link
              as={NextLink}
              href="/library"
              px={3}
              py={2}
              rounded="md"
              fontSize="sm"
              fontWeight="medium"
              color="gray.300"
              _hover={{ color: 'white', textDecoration: 'none' }}
            >
              Library
            </Link>
            <Link
              as={NextLink}
              href="/transactions"
              px={3}
              py={2}
              rounded="md"
              fontSize="sm"
              fontWeight="medium"
              color="gray.300"
              _hover={{ color: 'white', textDecoration: 'none' }}
            >
              Transactions
            </Link>
          </HStack>

          <Flex alignItems="center">
            <Button
              colorScheme="blue"
              size="md"
              fontSize="sm"
            >
              Connect Wallet
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar; 