import { Box, Heading, Text, HStack, chakra } from '@chakra-ui/react'
import { Card } from '@/shared/ui/card'
import type { TopicDetail } from '../model/types'

const Time = chakra('time')

export type TopicDetailCardProps = Omit<TopicDetail, 'id' | 'description'>

export const TopicDetailCard = ({
  title,
  author,
  date,
  content,
}: TopicDetailCardProps) => {
  return (
    <Card
      as="article"
      p="24px"
      border="1px solid"
      borderColor="border"
      margin="14px auto 24px"
      w="full">
      <Heading
        as="h1"
        fontFamily="body"
        fontSize="30px"
        fontWeight="800"
        color="text"
        m={0}>
        {title}
      </Heading>
      <HStack
        gap={0.5}
        margin="8px 0 16px"
        fontSize="12px"
        color="subtitleText">
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
        {content}
      </Text>
    </Card>
  )
}
