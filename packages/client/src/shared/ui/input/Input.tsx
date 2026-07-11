import { createRecipeContext, type HTMLChakraProps } from '@chakra-ui/react'

const { withContext } = createRecipeContext({ key: 'formInput' })

export type InputProps = HTMLChakraProps<'input'>

export const Input = withContext<HTMLInputElement, InputProps>('input')
