import { Link } from 'react-router-dom'
import { Flex, Box, Link as ChakraLink } from '@chakra-ui/react'

import { TopicCard } from '@/entities/topic'
import type { Topic } from '@/entities/topic'

export type ForumTopicsListProps = {
  topics: Topic[]
}

export const ForumTopicsList = ({ topics }: ForumTopicsListProps) => {
  return (
    <Flex as="ul" listStyleType="none" direction="column" gap={3}>
      {topics.map(({ id, ...card }) => (
        <Box as="li" key={id}>
          <ChakraLink asChild textDecoration="none" width="100%">
            <Link to={`/forum/${id}`}>
              <TopicCard {...card} />
            </Link>
          </ChakraLink>
        </Box>
      ))}
    </Flex>
  )
}
