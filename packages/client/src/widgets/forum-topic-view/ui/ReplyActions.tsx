import { useState } from 'react'

import type { Reply } from '@/entities/reply'
import { AddReplyForm } from '@/features/add-reply'

import styles from './ReplyActions.module.scss'

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
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen(true)}>
        Ответить
      </button>
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
