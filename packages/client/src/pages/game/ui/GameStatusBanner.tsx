import { Collapsible, Flex } from '@chakra-ui/react'
import { FC } from 'react'
import { TRANSITION } from '@/theme'
import { TGameStatus } from '../types/game'

const STATUS_LABEL: Partial<Record<TGameStatus, string>> = {
  won: 'Мяу! Победа 🐟',
  lost: 'Ой, разбудили пёсика 🐶',
}

const STATUS_BG: Partial<Record<TGameStatus, string>> = {
  won: 'mint',
  lost: 'pink',
}

type TProps = {
  status: TGameStatus
  onReset: () => void
}

export const GameStatusBanner: FC<TProps> = ({ status, onReset }) => (
  <Collapsible.Root open={status === 'won' || status === 'lost'}>
    <Collapsible.Content>
      <Flex
        direction="column"
        align="center"
        px={5}
        py={2}
        mb={4}
        bg={STATUS_BG[status] ?? 'card'}
        borderRadius="xl"
        fontWeight={700}
        cursor="pointer"
        transition={TRANSITION}
        _hover={{ opacity: '0.8' }}
        onClick={onReset}>
        {STATUS_LABEL[status]}
      </Flex>
    </Collapsible.Content>
  </Collapsible.Root>
)
