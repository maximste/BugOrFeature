import type { Topic } from '../model/types'
import styles from './TopicCard.module.scss'
const TOPIC_ICON_SRC = '/icons/IconTopic.svg'

export type TopicCardProps = Omit<Topic, 'id'>

export const TopicCard = ({
  title,
  description,
  author,
  date,
}: TopicCardProps) => {
  return (
    // Пока что просто li, но в будущем будет ссылка!!!
    <li className={styles.item}>
      <div className={styles.header}>
        <img
          src={TOPIC_ICON_SRC}
          alt="Тема топика"
          width={16}
          height={16}
          decoding="async"
          aria-hidden
        />
        <h2 className={styles.title}>{title}</h2>
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.footer}>
        <span aria-hidden>🐾</span>
        <span>{author}</span>
        <span aria-hidden>·</span>
        <time dateTime={date}>{date}</time>
      </div>
    </li>
  )
}
