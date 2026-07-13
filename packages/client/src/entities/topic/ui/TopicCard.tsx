import { Box, Heading, Text, HStack, chakra } from '@chakra-ui/react'
import { Card } from '@/shared/ui/card'
import { TRANSITION } from '@/theme'
import type { Topic } from '../model/types'

import ChatIcon from '@/assets/icons/chat.svg?react'

const Time = chakra('time')

export type TopicCardProps = Omit<Topic, 'id'>

export const TopicCard = ({
  title,
  description,
  author,
  date,
}: TopicCardProps) => {
  return (
    <Card
      as="article"
      p="20px"
      borderRadius="16px"
      border="1px solid"
      borderColor="border"
      cursor="pointer"
      width="100%"
      transition={`transform 0.22s ease, box-shadow 0.22s ease, ${TRANSITION}`}
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'cardHover' }}
      _active={{ transform: 'translateY(-1px)' }}>
      <HStack gap="6px" align="center">
        <ChatIcon width={16} height={16} aria-hidden />
        <Heading as="h2" fontSize="18px" fontWeight="700" color="text" m={0}>
          {title}
        </Heading>
      </HStack>
      <Text fontSize="14px" color="subtitleText" margin="4px 0 12px">
        {description}
      </Text>
      <HStack gap={0.5} fontSize="12px" color="subtitleText">
        <Box as="span" aria-hidden>
          🐾
        </Box>
        <Box as="span">{author}</Box>
        <Box as="span" aria-hidden>
          ·
        </Box>
        <Time dateTime={date}>{date}</Time>
      </HStack>
    </Card>
  )
}
