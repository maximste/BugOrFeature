import type { FormEvent } from 'react'
import { useState } from 'react'
import { chakra } from '@chakra-ui/react'

import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { FormField } from '@/shared/ui/form-field'
import { Textarea } from '@/shared/ui/textarea'

const Form = chakra('form')

export const AddCommentForm = () => {
  const [body, setBody] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <Form
      display="flex"
      flexDirection="column"
      gap={3}
      w="full"
      onSubmit={handleSubmit}
      noValidate>
      <Card
        display="flex"
        flexDirection="column"
        gap={3}
        p="21px"
        border="1px solid"
        borderColor="border"
        boxShadow="cardSoft">
        <FormField label="Ваш комментарий" htmlFor="topic-comment-body">
          <Textarea
            id="topic-comment-body"
            name="body"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Ваш комментарий..."
            rows={5}
          />
        </FormField>
        <Button type="submit">Добавить комментарий</Button>
      </Card>
    </Form>
  )
}
