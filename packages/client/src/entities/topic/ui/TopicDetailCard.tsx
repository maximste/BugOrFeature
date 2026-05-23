import type { TopicDetail } from '../model/types'

import styles from './TopicDetailCard.module.scss'

export type TopicDetailCardProps = Omit<TopicDetail, 'id' | 'description'>

export const TopicDetailCard = ({
  title,
  author,
  date,
  content,
}: TopicDetailCardProps) => {
  return (
    <article className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.meta}>
        <span aria-hidden>🐾</span>
        <span>{author}</span>
        <span aria-hidden>·</span>
        <time dateTime={date}>{date}</time>
      </div>
      <p className={styles.content}>{content}</p>
    </article>
  )
}
