import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Flex } from '@chakra-ui/react'
import { AuthProvider } from '@/app/providers'
import ErrorBoundary from '../errorBoundary/ErrorBoundary'

export const MainLayout = () => (
  <ErrorBoundary>
    <AuthProvider>
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
    </AuthProvider>
  </ErrorBoundary>
)
