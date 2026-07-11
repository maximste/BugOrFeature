import type { ReactNode } from 'react'
import { Box, Heading, Image, VStack } from '@chakra-ui/react'

export type ErrorPageLayoutProps = {
  icon: string
  code: ReactNode
  subheader: ReactNode
  children?: ReactNode
  actions?: ReactNode
}

export const ErrorPageLayout = ({
  icon,
  code,
  subheader,
  children,
  actions,
}: ErrorPageLayoutProps) => {
  return (
    <Box as="main" pt="20vh">
      <VStack as="section" textAlign="center" maxW="448px" mx="auto" gap={6}>
        <Image src={icon} alt="" display="block" mx="auto" mb="12px" />
        <Heading
          as="h1"
          fontFamily="fredoka"
          fontSize="72px"
          fontWeight="700"
          m={0}>
          {code}
        </Heading>
        <Heading as="h2" fontSize="20px" fontWeight="400" m={0}>
          {subheader}
        </Heading>
        {children ? (
          <Box fontSize="14px" css={{ '& p': { m: 0 } }}>
            {children}
          </Box>
        ) : null}
        {actions ? <VStack gap={3}>{actions}</VStack> : null}
      </VStack>
    </Box>
  )
}
