import { Text, Button, HStack, Image } from '@chakra-ui/react'
import { FC, Dispatch, SetStateAction } from 'react'
import restartUrl from '@/assets/icons/restart.svg'
import mineUrl from '@/assets/icons/fish.svg'
import timerUrl from '@/assets/icons/timer.svg'
import { TDifficulty, TMinesweeperApi } from '../types/game'
import { TRANSITION } from '../../../theme'
import { DIFFICULTY, DIFFICULTY_LABEL } from '../constants/game'

type TProps = {
  currentDifficulty: TDifficulty
  setCurrentDifficulty: Dispatch<SetStateAction<TDifficulty>>
} & Pick<TMinesweeperApi, 'minesLeft' | 'time' | 'reset'>

export const ControlPanel: FC<TProps> = props => {
  const { minesLeft, time, reset, currentDifficulty, setCurrentDifficulty } =
    props

  return (
    <HStack
      bg="card"
      boxShadow="card"
      borderRadius="2xl"
      p={3}
      my={4}
      gap={2}
      flexWrap="wrap">
      {(Object.keys(DIFFICULTY) as TDifficulty[]).map(difficulty => (
        <Button
          key={difficulty}
          unstyled
          bg={currentDifficulty === difficulty ? 'pink' : 'cyan'}
          borderRadius="2xl"
          fontSize="0.85rem"
          fontWeight={600}
          px={3}
          py={2}
          shadow="button"
          cursor="pointer"
          transition={TRANSITION}
          _hover={{ opacity: '0.8' }}
          onClick={() => setCurrentDifficulty(difficulty)}>
          {DIFFICULTY_LABEL[difficulty]}
        </Button>
      ))}

      <HStack gap={1} ml={8}>
        <Image src={mineUrl} alt="mine" w={4} h={4} />
        <Text textStyle="stat" fontWeight={600}>
          {Math.max(minesLeft, 0)}
        </Text>
      </HStack>

      <HStack gap={1}>
        <Image src={timerUrl} alt="timer" w={4} h={4} />
        <Text textStyle="stat" minWidth={8}>
          {Math.min(time, 999)}
        </Text>
      </HStack>

      <Button
        unstyled
        bg="card"
        borderRadius="full"
        px={3}
        py={2}
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition={TRANSITION}
        _hover={{ bg: 'purple' }}
        onClick={reset}
        title="Новая игра">
        <Image src={restartUrl} alt="restart" w={4} h={4} />
      </Button>
    </HStack>
  )
}
