import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Button, Flex, List, Text } from '@chakra-ui/react'

import { LogoutButton } from '@/features/logout'
import { TRANSITION } from '@/theme'

import { NavItem } from './NavItem'

type TNavLink = {
  to: string
  label: string
}

type TProps = {
  links: TNavLink[]
  showLogout: boolean
  isActive: (path: string) => boolean
}

const BurgerIcon = () => (
  <Box
    as="span"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    gap="3px"
    width="18px"
    height="18px"
    aria-hidden>
    <Box as="span" height="2px" bg="currentColor" borderRadius="full" />
    <Box as="span" height="2px" bg="currentColor" borderRadius="full" />
    <Box as="span" height="2px" bg="currentColor" borderRadius="full" />
  </Box>
)

const iconButtonProps = {
  unstyled: true,
  borderRadius: 'full',
  width: '36px',
  height: '36px',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: TRANSITION,
  _hover: { bg: 'purple' },
} as const

export const MobileNav = (props: TProps) => {
  const { links, showLogout, isActive } = props
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <Button
        {...iconButtonProps}
        aria-label="Открыть меню"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        title="Меню"
        onClick={() => setOpen(true)}>
        <BurgerIcon />
      </Button>

      {open ? (
        <Box
          position="fixed"
          inset={0}
          zIndex="modal"
          onClick={() => setOpen(false)}>
          <Box position="absolute" inset={0} bg="blackAlpha.500" />

          <Flex
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            position="absolute"
            top={0}
            right={0}
            height="100%"
            width="min(300px, 85vw)"
            direction="column"
            bg="background"
            color="text"
            boxShadow="card"
            onClick={event => event.stopPropagation()}>
            <Flex
              align="center"
              justify="space-between"
              borderBottom="1px solid"
              borderColor="peach"
              py={4}
              px={5}>
              <Text fontWeight={700} fontSize="1.125rem" fontFamily="fredoka">
                Меню
              </Text>
              <Button
                {...iconButtonProps}
                aria-label="Закрыть меню"
                title="Закрыть"
                onClick={() => setOpen(false)}>
                <Text as="span" fontSize="1.25rem" lineHeight="1" aria-hidden>
                  ×
                </Text>
              </Button>
            </Flex>

            <Flex direction="column" gap={4} px={4} py={5} flex="1">
              <Box as="nav">
                <List.Root flexDirection="column" gap={2}>
                  {links.map(({ to, label }) => (
                    <NavItem
                      key={to}
                      to={to}
                      label={label}
                      active={isActive(to)}
                    />
                  ))}
                </List.Root>
              </Box>

              {showLogout ? (
                <Box>
                  <LogoutButton />
                </Box>
              ) : null}
            </Flex>
          </Flex>
        </Box>
      ) : null}
    </>
  )
}
