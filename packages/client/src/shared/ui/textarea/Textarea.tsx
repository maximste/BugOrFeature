import { createRecipeContext, type HTMLChakraProps } from '@chakra-ui/react'

const { withContext } = createRecipeContext({ key: 'formInput' })

export type TextareaProps = HTMLChakraProps<'textarea'>

export const Textarea = withContext<HTMLTextAreaElement, TextareaProps>(
  'textarea',
  { defaultProps: { minH: '178px', resize: 'vertical' } }
)
