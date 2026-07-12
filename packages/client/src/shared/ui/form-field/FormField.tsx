import type { ReactNode } from 'react'
import { Box, chakra, type HTMLChakraProps } from '@chakra-ui/react'

const Label = chakra('label')

export type FormFieldProps = HTMLChakraProps<'div'> & {
  label: ReactNode
  htmlFor: string
  children: ReactNode
}

export const FormField = ({
  label,
  htmlFor,
  children,
  className = '',
  ...rest
}: FormFieldProps) => {
  return (
    <Box
      className={`input-field ${className}`.trim()}
      display="flex"
      flexDirection="column"
      gap={1}
      {...rest}>
      <Label htmlFor={htmlFor} textStyle="uiLabel" color="text">
        {label}
      </Label>
      {children}
    </Box>
  )
}
