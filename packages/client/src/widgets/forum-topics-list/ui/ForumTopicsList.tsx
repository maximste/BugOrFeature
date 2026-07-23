import { Link } from 'react-router-dom'
import { Flex, Box, Link as ChakraLink } from '@chakra-ui/react'

import { TopicCard, type Topic } from '@/entities/topic'
import { Button } from '@/shared/ui/button'

export type ForumTopicsListItem = Topic & { isOwn: boolean }

export type ForumTopicsListProps = {
  topics: ForumTopicsListItem[]
  onDeleteTopic?: (id: string) => void
}

export const ForumTopicsList = ({
  topics,
  onDeleteTopic,
}: ForumTopicsListProps) => {
  return (
    <Flex as="ul" listStyleType="none" direction="column" gap={3}>
      {topics.map(({ id, isOwn, ...card }) => (
        <Box as="li" key={id} position="relative">
          <ChakraLink asChild textDecoration="none" width="100%">
            <Link to={`/forum/${id}`}>
              <TopicCard {...card} />
            </Link>
          </ChakraLink>
          {isOwn && onDeleteTopic ? (
            <Button
              type="button"
              variant="white"
              position="absolute"
              top="12px"
              right="12px"
              fontSize="12px"
              padding="4px 10px"
              onClick={() => onDeleteTopic(id)}>
              Удалить
            </Button>
          ) : null}
        </Box>
      ))}
    </Flex>
  )
}
