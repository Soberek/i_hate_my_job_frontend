// pages/index.js
'use client'
import Head from 'next/head'
import {  Box, VStack, Heading, Text, Container, Flex } from '@chakra-ui/react'
import Button from './components/Button'

export default function Home() {
  return (
   
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Head>
          <title>Generator Sprawozdań OZiPZ</title>
          <meta name="description" content="Profesjonalny generator sprawozdań online" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Box as="header" bg="ternary.100" color="white" p={4}>
          <Heading as="h1" size="lg">Generator Sprawozdań</Heading>
        </Box>

        <Flex as="main" flex="1" alignItems="center" justifyContent="center">
          <Container maxW="container.md" textAlign="center">
            <VStack spacing={8}>
              <Heading as="h2" size="2xl">Twórz profesjonalne sprawozdania w mgnieniu oka</Heading>
              <Text fontSize="xl">Nasz generator sprawozdań pomoże Ci szybko i łatwo przygotować wysokiej jakości raporty Oświaty Zdrowotnej i Promocji Zdrowia.</Text>
              <Button label={"Rozpocznij Teraz"} />

            </VStack>
          </Container>
        </Flex>

        <Box as="footer" bg="gray.100" p={4} textAlign="center">
          <Text>&copy; 2024 Generator Sprawozdań. Wszelkie prawa zastrzeżone.</Text>
        </Box>
      </Box>
 
  )
}