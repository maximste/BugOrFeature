import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Flex } from '@chakra-ui/react'
import ErrorBoundary from '../errorBoundary/ErrorBoundary'

export const MainLayout = () => (
  <ErrorBoundary>
    <Header />
    <Flex
      as="main"
      direction="column"
      align="center"
      px={4}
      pt={8}
      pb={10}
      mx="auto"
      maxW="1200px">
      <Outlet />
    </Flex>
  </ErrorBoundary>
)
