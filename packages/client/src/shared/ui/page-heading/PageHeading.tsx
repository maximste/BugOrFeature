import type { ReactNode } from 'react'
import { Box, Heading, Text, type HTMLChakraProps } from '@chakra-ui/react'

export type PageHeadingProps = Omit<HTMLChakraProps<'div'>, 'title'> & {
  title: ReactNode
  subtitle?: ReactNode
  align?: 'flex-start' | 'center'
  titleFontSize?: string
  subtitleFontSize?: string
}

export const PageHeading = ({
  title,
  subtitle,
  align = 'flex-start',
  titleFontSize = '30px',
  subtitleFontSize = '16px',
  ...rest
}: PageHeadingProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={align}
      gap={2}
      {...rest}>
      <Heading
        as="h1"
        fontSize={titleFontSize}
        fontWeight="800"
        color="text"
        m={0}>
        {title}
      </Heading>
      {subtitle != null && subtitle !== '' ? (
        <Text as="p" fontSize={subtitleFontSize} color="subtitleText" m={0}>
          {subtitle}
        </Text>
      ) : null}
    </Box>
  )
}
