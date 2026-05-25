import { Link } from 'react-router-dom'
import { Box, Flex, List, Text } from '@chakra-ui/react'

import { useAuth } from '@/app/providers'
import { LogoutButton } from '@/features/logout'

import LogoIcon from '@/assets/icons/logo.svg?react'

export const Header = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Flex
      bg="background/70"
      width="full"
      borderBottom="1px solid {colors.peach}">
      <Flex
        align="center"
        justify="space-between"
        maxWidth="1200px"
        width="full"
        mx="auto"
        px={5}
        py={3}>
        <Link to="/">
          <Flex align="center" gap={2}>
            <Box bg="pink/40" width="max-content" p={2} borderRadius="full">
              <LogoIcon width={20} height={20} stroke="red" />
            </Box>
            <Text fontWeight={700} fontSize="1.125rem" fontFamily="fredoka">
              Catsweeper
            </Text>
          </Flex>
        </Link>

        <Box as="nav">
          <List.Root flexDirection="row" gap={4}>
            <List.Item>
              <Link to="/">Главная</Link>
            </List.Item>
            <List.Item>
              <Link to="/game">Игра</Link>
            </List.Item>
            <List.Item>
              <Link to="/leaderboard">Лидерборд</Link>
            </List.Item>
            <List.Item>
              <Link to="/forum">Форум</Link>
            </List.Item>
            {!isAuthenticated ? (
              <>
                <List.Item>
                  <Link to="/signin">Вход</Link>
                </List.Item>
                <List.Item>
                  <Link to="/signup">Регистрация</Link>
                </List.Item>
              </>
            ) : (
              <List.Item>
                <LogoutButton />
              </List.Item>
            )}
            <List.Item>
              <Link to="/404">404</Link>
            </List.Item>
          </List.Root>
        </Box>
      </Flex>
    </Flex>
  )
}
