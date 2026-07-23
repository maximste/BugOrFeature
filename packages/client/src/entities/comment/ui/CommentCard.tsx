import type { ReactNode } from 'react'
import { Box, chakra, HStack, Text, VStack } from '@chakra-ui/react'

import { ReactionBar, type Emotion } from '@/entities/reaction'
import { ReplyCard, type Reply } from '@/entities/reply'
import { Card } from '@/shared/ui/card'

import type { Comment as CommentItem } from '../model/types'

const Time = chakra('time')

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
    <Card
      as="li"
      listStyleType="none"
      p="24px"
      border="1px solid"
      borderColor="border"
      boxShadow="cardSoft">
      <HStack gap={0.5} margin="0 0 16px" fontSize="12px" color="subtitleText">
        <Box as="span" aria-hidden>
          🐾
        </Box>
        <Box as="span">{author}</Box>
        <Box as="span" aria-hidden>
          ·
        </Box>
        <Time dateTime={date}>{date}</Time>
      </HStack>
      <Text m={0} fontSize="16px" color="text">
        {body}
      </Text>
      <HStack justify="space-between" align="center" gap={3} mt="12px">
        <ReactionBar
          reactions={reactions}
          myReaction={myReaction}
          onReact={onReact ?? (() => undefined)}
          disabled={reactionsDisabled}
        />
        {renderReplyActions ? renderReplyActions(null) : null}
      </HStack>
      {replies.length > 0 ? (
        <VStack
          as="ul"
          listStyleType="none"
          align="stretch"
          gap={3}
          mt="16px"
          pl="20px"
          borderLeft="2px solid"
          borderColor="border">
          {replies.map(reply => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              renderActions={renderReplyActions}
            />
          ))}
        </VStack>
      ) : null}
    </Card>
  )
}
