import { createRecipeContext, type HTMLChakraProps } from '@chakra-ui/react'

const { withContext } = createRecipeContext({ key: 'card' })

export type CardProps = HTMLChakraProps<'div'>

export const Card = withContext<HTMLDivElement, CardProps>('div')

export type CardFormProps = HTMLChakraProps<'form'>

export const CardForm = withContext<HTMLFormElement, CardFormProps>('form')
