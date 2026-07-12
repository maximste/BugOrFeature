import type { ReactNode } from 'react'
import { Box, chakra, HStack, VStack } from '@chakra-ui/react'

import type { Reply } from '../model/types'

const Time = chakra('time')

export type ReplyCardProps = {
  reply: Reply
  renderActions?: (reply: Reply) => ReactNode
}

export const ReplyCard = ({ reply, renderActions }: ReplyCardProps) => {
  return (
    <Box
      as="li"
      listStyleType="none"
      p="16px"
      border="1px solid"
      borderColor="border"
      borderRadius="16px"
      background="card/80">
      <HStack gap="2px" mb="8px" fontSize="12px" color="subtitleText">
        <Box as="span" aria-hidden>
          🐾
        </Box>
        <Box as="span">{reply.author}</Box>
        <Box as="span" aria-hidden>
          ·
        </Box>
        <Time dateTime={reply.date}>{reply.date}</Time>
      </HStack>
      <Box as="p" m={0} fontSize="14px" color="text">
        {reply.body}
      </Box>
      {renderActions ? <Box mt="8px">{renderActions(reply)}</Box> : null}
      {reply.replies.length > 0 ? (
        <VStack
          as="ul"
          listStyleType="none"
          align="stretch"
          gap="12px"
          mt="12px"
          pl="20px"
          borderLeft="2px solid"
          borderColor="border">
          {reply.replies.map(child => (
            <ReplyCard
              key={child.id}
              reply={child}
              renderActions={renderActions}
            />
          ))}
        </VStack>
      ) : null}
    </Box>
  )
}
