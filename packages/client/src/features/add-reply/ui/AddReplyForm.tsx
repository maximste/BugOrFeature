import type { FormEvent } from 'react'
import { useState } from 'react'

import { postReply } from '@/shared/api'
import type { ReplyResponse } from '@/shared/api'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'

import styles from './AddReplyForm.module.scss'

export type AddReplyFormProps = {
  commentId: string
  parentReplyId?: string | null
  onSuccess: (reply: ReplyResponse) => void
  onCancel?: () => void
}

export const AddReplyForm = ({
  commentId,
  parentReplyId,
  onSuccess,
  onCancel,
}: AddReplyFormProps) => {
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
      const reply = await postReply(commentId, {
        body: trimmed,
        parentReplyId: parentReplyId ?? null,
      })
      setBody('')
      onSuccess(reply)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось отправить ответ'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {error != null ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <Textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Ваш ответ..."
        aria-label="Ваш ответ"
        rows={3}
        disabled={loading}
      />
      <div className={styles.actions}>
        <Button type="submit" disabled={loading}>
          {loading ? 'Отправка…' : 'Ответить'}
        </Button>
        {onCancel ? (
          <button
            type="button"
            className={styles.cancel}
            onClick={onCancel}
            disabled={loading}>
            Отмена
          </button>
        ) : null}
      </div>
    </form>
  )
}
