import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Text } from '@chakra-ui/react'

import { postTopic } from '@/shared/api'
import { useAsyncAction } from '@/shared/hooks'
import { Button } from '@/shared/ui/button'
import { CardForm } from '@/shared/ui/card'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

export const CreateTopicForm = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const { loading, error, run, fail } = useAsyncAction()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()

    if (!trimmedTitle || !trimmedBody) {
      fail('Заполните заголовок и текст темы')
      return
    }

    const topic = await run(
      () => postTopic({ title: trimmedTitle, body: trimmedBody }),
      'Не удалось создать тему'
    )

    if (topic) {
      navigate(`/forum/${topic.id}`)
    }
  }

  return (
    <CardForm
      display="flex"
      flexDirection="column"
      gap={4}
      p="35px 25px 25px"
      border="1px solid"
      borderColor="border"
      onSubmit={handleSubmit}
      noValidate>
      {error != null ? (
        <Text m={0} fontSize="14px" color="danger" role="alert">
          {error}
        </Text>
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
    </CardForm>
  )
}
