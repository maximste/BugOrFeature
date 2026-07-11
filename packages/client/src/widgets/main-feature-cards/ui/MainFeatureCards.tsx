import { Flex, Heading, Text } from '@chakra-ui/react'
import { Card } from '@/shared/ui/card'
import type { MainFeatureCard } from '../model/types'

export type MainFeatureCardsProps = {
  cards: MainFeatureCard[]
}

export const MainFeatureCards = ({ cards }: MainFeatureCardsProps) => {
  return (
    <Flex flexWrap="wrap" gap={4} w="full">
      {cards.map(card => (
        <Card as="article" key={card.id} p="24px" flex="1 1 200px" gap={1}>
          <Flex
            justifyContent="center"
            alignItems="center"
            w="48px"
            h="48px"
            background="purple/50"
            borderRadius="16px">
            <img src={card.iconSrc} alt={card.iconAlt} width={24} height={24} />
          </Flex>
          <Heading
            as="h3"
            display="flex"
            alignItems="end"
            justifyContent="start"
            fontFamily="body"
            fontSize="18px"
            fontWeight="800"
            lineHeight="28px"
            height="40px"
            m={0}>
            {card.title}
          </Heading>
          <Text
            m={0}
            fontFamily="body"
            fontSize="12px"
            fontWeight="400"
            color="subtitleText"
            textAlign="start"
            whiteSpace="pre-line">
            {card.description}
          </Text>
        </Card>
      ))}
    </Flex>
  )
}
