import { Link } from 'react-router-dom'

import { TopicCard } from '@/entities/topic'
import type { Topic } from '@/entities/topic'

import styles from './ForumTopicsList.module.scss'

export type ForumTopicsListProps = {
  topics: Topic[]
}

export const ForumTopicsList = ({ topics }: ForumTopicsListProps) => {
  return (
    <ul className={styles.list}>
      {topics.map(({ id, ...card }) => (
        <li key={id} className={styles.item}>
          <Link className={styles.cardLink} to={`/forum/${id}`}>
            <TopicCard {...card} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
