import { Box, Text, HStack, chakra } from '@chakra-ui/react'
import { Card } from '@/shared/ui/card'
import type { Comment as CommentItem } from '../model/types'

const Time = chakra('time')

export type CommentCardProps = Omit<CommentItem, 'id'>

export const CommentCard = ({ author, date, body }: CommentCardProps) => {
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
    </Card>
  )
}
