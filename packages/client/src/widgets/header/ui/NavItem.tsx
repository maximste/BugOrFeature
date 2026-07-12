import { Link } from 'react-router-dom'
import { List } from '@chakra-ui/react'
import { FC } from 'react'

import { TRANSITION } from '@/theme'

type TProps = {
  to: string
  label: string
  active: boolean
}

export const NavItem: FC<TProps> = props => {
  const { to, label, active } = props
  return (
    <List.Item
      bg={active ? 'purple/60' : undefined}
      borderRadius="full"
      p="8px 16px"
      transition={TRANSITION}
      _hover={active ? undefined : { bg: 'purple/20' }}>
      <Link to={to}>{label}</Link>
    </List.Item>
  )
}
