import type { FormEvent } from 'react'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form-field'
import { Textarea } from '@/shared/ui/textarea'

import styles from './AddCommentForm.module.scss'

export const AddCommentForm = () => {
  const [body, setBody] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.card}>
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
      </div>
    </form>
  )
}
