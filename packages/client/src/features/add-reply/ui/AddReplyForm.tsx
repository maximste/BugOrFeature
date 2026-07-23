import { useState, type FormEvent } from 'react'
import { chakra, HStack, Text } from '@chakra-ui/react'

import { postReply, type ReplyResponse } from '@/shared/api'
import { useAsyncAction } from '@/shared/hooks'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'

const Form = chakra('form')
const CancelButton = chakra('button')

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
  const { loading, error, run } = useAsyncAction()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = body.trim()

    if (!trimmed) {
      return
    }

    const reply = await run(
      () =>
        postReply(commentId, {
          body: trimmed,
          parentReplyId: parentReplyId ?? null,
        }),
      'Не удалось отправить ответ'
    )

    if (reply) {
      setBody('')
      onSuccess(reply)
    }
  }

  return (
    <Form
      display="flex"
      flexDirection="column"
      gap={2}
      w="full"
      onSubmit={handleSubmit}
      noValidate>
      {error != null ? (
        <Text m={0} fontSize="14px" color="danger" role="alert">
          {error}
        </Text>
      ) : null}
      <Textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Ваш ответ..."
        aria-label="Ваш ответ"
        rows={3}
        disabled={loading}
      />
      <HStack gap={3}>
        <Button type="submit" disabled={loading}>
          {loading ? 'Отправка…' : 'Ответить'}
        </Button>
        {onCancel ? (
          <CancelButton
            type="button"
            background="none"
            border="none"
            p={0}
            fontSize="14px"
            color="subtitleText"
            cursor={loading ? 'default' : 'pointer'}
            opacity={loading ? 0.6 : 1}
            onClick={onCancel}
            disabled={loading}>
            Отмена
          </CancelButton>
        ) : null}
      </HStack>
    </Form>
  )
}
