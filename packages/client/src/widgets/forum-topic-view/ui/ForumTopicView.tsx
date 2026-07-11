import { Flex, Heading, Text } from '@chakra-ui/react'

import { CommentCard } from '@/entities/comment'
import type { Comment } from '@/entities/comment'
import { TopicDetailCard } from '@/entities/topic'
import type { TopicDetail } from '@/entities/topic'
import { AddCommentForm } from '@/features/add-comment'
import { BackLink } from '@/shared/ui/back-link'

export type ForumTopicViewProps = {
  topic: TopicDetail
  comments: Comment[]
}

export const ForumTopicView = ({ topic, comments }: ForumTopicViewProps) => {
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
            <CommentCard key={id} {...rest} />
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
      <AddCommentForm />
    </>
  )
}
