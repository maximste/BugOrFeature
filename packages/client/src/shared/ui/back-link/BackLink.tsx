import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link, type HTMLChakraProps } from '@chakra-ui/react'

export type BackLinkProps = HTMLChakraProps<'a'> & {
  to?: string
  children?: ReactNode
}

export const BackLink = ({
  to = '/',
  children = '← На главную',
  ...rest
}: BackLinkProps) => {
  return (
    <Link
      asChild
      fontFamily="body"
      fontSize="14px"
      fontWeight="400"
      color="subtitleText"
      _hover={{ color: 'text' }}
      {...rest}>
      <RouterLink to={to}>{children}</RouterLink>
    </Link>
  )
}
