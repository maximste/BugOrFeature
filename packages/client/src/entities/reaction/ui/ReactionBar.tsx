import { Box, chakra, HStack } from '@chakra-ui/react'

import {
  EMOTION_EMOJI,
  type Emotion,
  type ReactionSummary,
} from '../model/types'

const ReactionButton = chakra('button')

export type ReactionBarProps = {
  reactions: ReactionSummary[]
  myReaction: Emotion | null
  onReact: (emotion: Emotion) => void
  disabled?: boolean
}

export const ReactionBar = ({
  reactions,
  myReaction,
  onReact,
  disabled,
}: ReactionBarProps) => {
  return (
    <HStack gap="6px" role="group" aria-label="Реакции">
      {reactions.map(({ emotion, count }) => {
        const active = myReaction === emotion

        return (
          <ReactionButton
            key={emotion}
            type="button"
            display="flex"
            alignItems="center"
            gap="4px"
            padding="4px 10px"
            border="1px solid"
            borderColor={active ? 'buttonBg' : 'border'}
            borderRadius="pill"
            background={active ? 'buttonBg' : 'card/80'}
            fontSize="14px"
            color="text"
            cursor={disabled ? 'default' : 'pointer'}
            opacity={disabled ? 0.6 : 1}
            onClick={() => onReact(emotion)}
            disabled={disabled}
            aria-pressed={active}>
            <Box as="span" aria-hidden>
              {EMOTION_EMOJI[emotion]}
            </Box>
            {count > 0 ? (
              <Box as="span" fontSize="12px">
                {count}
              </Box>
            ) : null}
          </ReactionButton>
        )
      })}
    </HStack>
  )
}
