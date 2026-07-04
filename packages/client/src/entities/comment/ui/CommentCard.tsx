import type { ReactNode } from 'react'

import { ReactionBar } from '@/entities/reaction'
import type { Emotion } from '@/entities/reaction'
import { ReplyCard } from '@/entities/reply'
import type { Reply } from '@/entities/reply'

import type { Comment as CommentItem } from '../model/types'

import styles from './CommentCard.module.scss'

export type CommentCardProps = Omit<CommentItem, 'id'> & {
  onReact?: (emotion: Emotion) => void
  reactionsDisabled?: boolean
  /** null — ответ на сам комментарий, иначе — ответ на конкретный вложенный reply */
  renderReplyActions?: (reply: Reply | null) => ReactNode
}

export const CommentCard = ({
  author,
  date,
  body,
  replies,
  reactions,
  myReaction,
  onReact,
  reactionsDisabled,
  renderReplyActions,
}: CommentCardProps) => {
  return (
    <li className={styles.root}>
      <div className={styles.meta}>
        <span aria-hidden>🐾</span>
        <span>{author}</span>
        <span aria-hidden>·</span>
        <time dateTime={date}>{date}</time>
      </div>
      <p className={styles.body}>{body}</p>
      <div className={styles.footer}>
        <ReactionBar
          reactions={reactions}
          myReaction={myReaction}
          onReact={onReact ?? (() => undefined)}
          disabled={reactionsDisabled}
        />
        {renderReplyActions ? renderReplyActions(null) : null}
      </div>
      {replies.length > 0 ? (
        <ul className={styles.replies}>
          {replies.map(reply => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              renderActions={renderReplyActions}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}
