import type { Comment as CommentItem } from '../model/types'

import styles from './CommentCard.module.scss'

export type CommentCardProps = Omit<CommentItem, 'id'>

export const CommentCard = ({ author, date, body }: CommentCardProps) => {
  return (
    <li className={styles.root}>
      <div className={styles.meta}>
        <span aria-hidden>🐾</span>
        <span>{author}</span>
        <span aria-hidden>·</span>
        <time dateTime={date}>{date}</time>
      </div>
      <p className={styles.body}>{body}</p>
    </li>
  )
}
