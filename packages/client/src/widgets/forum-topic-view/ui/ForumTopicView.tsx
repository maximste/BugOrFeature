import { CommentCard } from '@/entities/comment'
import type { Comment } from '@/entities/comment'
import type { Emotion } from '@/entities/reaction'
import type { Reply } from '@/entities/reply'
import { TopicDetailCard } from '@/entities/topic'
import type { TopicDetail } from '@/entities/topic'
import { AddCommentForm } from '@/features/add-comment'
import type { CommentResponse } from '@/shared/api'
import { BackLink } from '@/shared/ui/back-link'

import { ReplyActions } from './ReplyActions'

import styles from './ForumTopicView.module.scss'

export type ForumTopicViewProps = {
  topic: TopicDetail
  comments: Comment[]
  onCommentAdded: (comment: CommentResponse) => void
  onReplyAdded: (
    commentId: string,
    parentReplyId: string | null,
    reply: Reply
  ) => void
  onReact: (commentId: string, emotion: Emotion) => void
}

const COMMENTS_ICON_SRC = '/img/not-found-icon.png'

export const ForumTopicView = ({
  topic,
  comments,
  onCommentAdded,
  onReplyAdded,
  onReact,
}: ForumTopicViewProps) => {
  const hasComments = comments.length > 0

  return (
    <>
      <BackLink to="/forum" className={styles.back}>
        ← К темам
      </BackLink>
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
            <CommentCard
              key={id}
              {...rest}
              onReact={emotion => onReact(id, emotion)}
              renderReplyActions={reply => (
                <ReplyActions
                  commentId={id}
                  reply={reply}
                  onReplyAdded={(parentReplyId, newReply) =>
                    onReplyAdded(id, parentReplyId, newReply)
                  }
                />
              )}
            />
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
      <AddCommentForm topicId={topic.id} onSuccess={onCommentAdded} />
    </>
  )
}
