import type { ReactNode } from 'react'

import type { Reply } from '../model/types'

import styles from './ReplyCard.module.scss'

export type ReplyCardProps = {
  reply: Reply
  renderActions?: (reply: Reply) => ReactNode
}

export const ReplyCard = ({ reply, renderActions }: ReplyCardProps) => {
  return (
    <li className={styles.root}>
      <div className={styles.meta}>
        <span aria-hidden>🐾</span>
        <span>{reply.author}</span>
        <span aria-hidden>·</span>
        <time dateTime={reply.date}>{reply.date}</time>
      </div>
      <p className={styles.body}>{reply.body}</p>
      {renderActions ? (
        <div className={styles.actions}>{renderActions(reply)}</div>
      ) : null}
      {reply.replies.length > 0 ? (
        <ul className={styles.children}>
          {reply.replies.map(child => (
            <ReplyCard
              key={child.id}
              reply={child}
              renderActions={renderActions}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}
