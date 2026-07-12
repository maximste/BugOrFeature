import { createRecipeContext, type HTMLChakraProps } from '@chakra-ui/react'

const { withContext } = createRecipeContext({ key: 'appButton' })

export type ButtonVariant = 'default' | 'white' | 'cyan'

export type ButtonProps = HTMLChakraProps<'button', { variant?: ButtonVariant }>

export const Button = withContext<HTMLButtonElement, ButtonProps>('button', {
  defaultProps: { type: 'button', variant: 'default' },
})
