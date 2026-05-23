import { Link } from 'react-router-dom'

import { CommentCard } from '@/entities/comment'
import type { Comment } from '@/entities/comment'
import { TopicDetailCard } from '@/entities/topic'
import type { TopicDetail } from '@/entities/topic'
import { AddCommentForm } from '@/features/add-comment'

import styles from './ForumTopicView.module.scss'

export type ForumTopicViewProps = {
  topic: TopicDetail
  comments: Comment[]
}

const COMMENTS_ICON_SRC = '/img/not-found-icon.png'

export const ForumTopicView = ({ topic, comments }: ForumTopicViewProps) => {
  const hasComments = comments.length > 0

  return (
    <>
      <Link className={styles.back} to="/forum">
        ← К темам
      </Link>
      <TopicDetailCard
        title={topic.title}
        author={topic.author}
        date={topic.date}
        content={topic.content}
      />
      <h2 className={styles.commentsHeading}>
        Комментарии · {comments.length}
      </h2>
      {hasComments ? (
        <ul className={styles.commentList}>
          {comments.map(({ id, ...rest }) => (
            <CommentCard key={id} {...rest} />
          ))}
        </ul>
      ) : (
        <div className={styles.commentsEmpty}>
          <p className={styles.commentsEmptyText}>
            Будьте первым, кто прокомментирует
          </p>
          <img
            src={COMMENTS_ICON_SRC}
            alt="Комментарии не найдены"
            width={16}
            height={16}
            aria-hidden
          />
        </div>
      )}
      <AddCommentForm />
    </>
  )
}
