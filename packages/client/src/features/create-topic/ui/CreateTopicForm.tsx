import type { FormEvent } from 'react'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { CardForm } from '@/shared/ui/card'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

export const CreateTopicForm = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <CardForm
      display="flex"
      flexDirection="column"
      gap={4}
      p="35px 25px 25px"
      onSubmit={handleSubmit}
      noValidate>
      <FormField label="Заголовок" htmlFor="new-topic-title">
        <Input
          id="new-topic-title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Как пройти 'Дикого кота' за минуту?"
          autoComplete="off"
        />
      </FormField>
      <FormField label="Текст" htmlFor="new-topic-body">
        <Textarea
          id="new-topic-body"
          name="body"
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Поделитесь мыслями..."
        />
      </FormField>
      <Button type="submit">Опубликовать</Button>
    </CardForm>
  )
}
