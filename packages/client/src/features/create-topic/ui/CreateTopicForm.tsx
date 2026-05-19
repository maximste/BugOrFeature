import type { FormEvent } from 'react'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

import styles from './CreateTopicForm.module.scss'

export const CreateTopicForm = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
    </form>
  )
}
