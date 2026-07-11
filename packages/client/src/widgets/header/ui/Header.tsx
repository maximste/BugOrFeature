import { Link, useLocation } from 'react-router-dom'
import { Box, Flex, List, Text } from '@chakra-ui/react'

import { useAuth } from '@/app/providers'
import { LogoutButton } from '@/features/logout'

import LogoIcon from '@/assets/icons/logo.svg?react'

import { NavItem } from './NavItem'

const NAV_LINKS = [
  { to: '/', label: 'Главная' },
  { to: '/game', label: 'Игра' },
  { to: '/leaderboard-page', label: 'Лидерборд' },
  { to: '/forum', label: 'Форум' },
  { to: '/profile', label: 'Профиль' },
]

const GUEST_LINKS = [
  { to: '/signin', label: 'Вход' },
  { to: '/signup', label: 'Регистрация' },
]

export const Header = () => {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()

  const isActive = (path: string) => pathname === path

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
              <LogoIcon width={20} height={20} />
            </Box>
            <Text fontWeight={700} fontSize="1.125rem" fontFamily="fredoka">
              Catsweeper
            </Text>
          </Flex>
        </Link>

        <Box as="nav">
          <List.Root flexDirection="row" gap={2}>
            {isAuthenticated ? (
              <>
                {NAV_LINKS.map(({ to, label }) => (
                  <NavItem
                    key={to}
                    to={to}
                    label={label}
                    active={isActive(to)}
                  />
                ))}
                <List.Item>
                  <LogoutButton />
                </List.Item>
              </>
            ) : (
              <>
                {GUEST_LINKS.map(({ to, label }) => (
                  <NavItem
                    key={to}
                    to={to}
                    label={label}
                    active={isActive(to)}
                  />
                ))}
              </>
            )}
          </List.Root>
        </Box>
      </Flex>
    </Flex>
  )
}
