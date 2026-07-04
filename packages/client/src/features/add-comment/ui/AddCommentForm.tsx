import type { FormEvent } from 'react'
import { useState } from 'react'

import { postComment } from '@/shared/api'
import type { CommentResponse } from '@/shared/api'
import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form-field'
import { Textarea } from '@/shared/ui/textarea'

import styles from './AddCommentForm.module.scss'

export type AddCommentFormProps = {
  topicId: string
  onSuccess: (comment: CommentResponse) => void
}

export const AddCommentForm = ({ topicId, onSuccess }: AddCommentFormProps) => {
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = body.trim()

    if (!trimmed) {
      return
    }

    setError(null)
    setLoading(true)

    try {
      const comment = await postComment(topicId, { body: trimmed })
      setBody('')
      onSuccess(comment)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось отправить комментарий'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.card}>
        {error != null ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <FormField label="Ваш комментарий" htmlFor="topic-comment-body">
          <Textarea
            id="topic-comment-body"
            name="body"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Ваш комментарий..."
            rows={5}
            disabled={loading}
          />
        </FormField>
        <Button type="submit" disabled={loading}>
          {loading ? 'Отправка…' : 'Добавить комментарий'}
        </Button>
      </div>
    </form>
  )
}
