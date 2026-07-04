import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { postTopic } from '@/shared/api'
import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

import styles from './CreateTopicForm.module.scss'

export const CreateTopicForm = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()

    if (!trimmedTitle || !trimmedBody) {
      setError('Заполните заголовок и текст темы')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const topic = await postTopic({ title: trimmedTitle, body: trimmedBody })
      navigate(`/forum/${topic.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать тему')
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
      <FormField label="Заголовок" htmlFor="new-topic-title">
        <Input
          id="new-topic-title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Как пройти 'Дикого кота' за минуту?"
          autoComplete="off"
          disabled={loading}
        />
      </FormField>
      <FormField label="Текст" htmlFor="new-topic-body">
        <Textarea
          id="new-topic-body"
          name="body"
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Поделитесь мыслями..."
          disabled={loading}
        />
      </FormField>
      <Button type="submit" disabled={loading}>
        {loading ? 'Публикация…' : 'Опубликовать'}
      </Button>
    </form>
  )
}
