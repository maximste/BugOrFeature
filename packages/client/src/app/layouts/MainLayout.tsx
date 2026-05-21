import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Flex } from '@chakra-ui/react'

export const MainLayout = () => (
  <>
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
  </>
)
