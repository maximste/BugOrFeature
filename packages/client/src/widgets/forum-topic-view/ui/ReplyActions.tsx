import { useState } from 'react'
import { chakra } from '@chakra-ui/react'

import type { Reply } from '@/entities/reply'
import { AddReplyForm } from '@/features/add-reply'

const ToggleButton = chakra('button')

export type ReplyActionsProps = {
  commentId: string
  reply: Reply | null
  onReplyAdded: (parentReplyId: string | null, reply: Reply) => void
}

export const ReplyActions = ({
  commentId,
  reply,
  onReplyAdded,
}: ReplyActionsProps) => {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <ToggleButton
        type="button"
        alignSelf="flex-start"
        background="none"
        border="none"
        p={0}
        fontSize="14px"
        color="subtitleText"
        cursor="pointer"
        _hover={{ color: 'danger' }}
        onClick={() => setOpen(true)}>
        Ответить
      </ToggleButton>
    )
  }

  return (
    <AddReplyForm
      commentId={commentId}
      parentReplyId={reply?.id ?? null}
      onSuccess={newReply => {
        onReplyAdded(reply?.id ?? null, newReply)
        setOpen(false)
      }}
      onCancel={() => setOpen(false)}
    />
  )
}
