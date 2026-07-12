import { Flex, Heading, Text } from '@chakra-ui/react'

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
      <BackLink
        to="/forum"
        alignSelf="flex-start"
        color="text"
        _hover={{ color: 'danger' }}>
        ← К темам
      </BackLink>
      <TopicDetailCard
        title={topic.title}
        author={topic.author}
        date={topic.date}
        content={topic.content}
      />
      <Heading
        as="h2"
        fontFamily="body"
        fontSize="20px"
        fontWeight="800"
        color="text"
        m={0}
        pb={2}
        alignSelf="flex-start">
        Комментарии · {comments.length}
      </Heading>
      {hasComments ? (
        <Flex
          as="ul"
          listStyleType="none"
          direction="column"
          gap={4}
          w="full"
          pb={8}>
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
        </Flex>
      ) : (
        <Text
          m={0}
          fontFamily="body"
          fontSize="14px"
          fontWeight="400"
          maxW="22rem"
          color="text"
          opacity={0.92}
          margin="16px 0 14px"
          pb={8}>
          Будьте первым, кто прокомментирует 🐱
        </Text>
      )}
      <AddCommentForm topicId={topic.id} onSuccess={onCommentAdded} />
    </>
  )
}
