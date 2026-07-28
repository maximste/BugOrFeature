import { Text, Button, HStack } from '@chakra-ui/react'
import { FC, Dispatch, SetStateAction } from 'react'
import RestartIcon from '@/assets/icons/restart.svg?react'
import MineIcon from '@/assets/icons/fish.svg?react'
import TimerIcon from '@/assets/icons/timer.svg?react'
import FullscreenIcon from '@/assets/icons/fullscreen.svg?react'
import ExitFullscreenIcon from '@/assets/icons/exitFullscreen.svg?react'
import SoundIcon from '@/assets/icons/sound.svg?react'
import MuteIcon from '@/assets/icons/mute.svg?react'
import { TDifficulty, TMinesweeperApi } from '../types/game'
import { TRANSITION } from '../../../theme'
import { DIFFICULTY, DIFFICULTY_LABEL } from '../constants/game'
import { CustomGamePopover } from './CustomGamePopover'

type TProps = {
  currentDifficulty: TDifficulty
  setCurrentDifficulty: Dispatch<SetStateAction<TDifficulty>>
  onCustomStart: (rows: number, cols: number, mines: number) => void
  isFullscreen: boolean
  toggleFullscreen: () => void
  isMuted: boolean
  toggleMute: () => void
} & Pick<TMinesweeperApi, 'minesLeft' | 'time' | 'reset'>

export const ControlPanel: FC<TProps> = props => {
  const {
    minesLeft,
    time,
    reset,
    currentDifficulty,
    setCurrentDifficulty,
    onCustomStart,
    isFullscreen,
    toggleFullscreen,
    isMuted,
    toggleMute,
  } = props

  const presets = Object.keys(DIFFICULTY) as Exclude<TDifficulty, 'custom'>[]

  return (
    <HStack
      bg="card"
      boxShadow="card"
      borderRadius="2xl"
      p={3}
      my={4}
      gap={2}
      flexWrap="wrap">
      {presets.map(difficulty => (
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

      <CustomGamePopover
        isActive={currentDifficulty === 'custom'}
        onCustomStart={onCustomStart}
      />

      <HStack gap={1} ml={8}>
        <MineIcon width={16} height={16} />
        <Text textStyle="stat" fontWeight={600}>
          {Math.max(minesLeft, 0)}
        </Text>
      </HStack>

      <HStack gap={1}>
        <TimerIcon width={16} height={16} />
        <Text textStyle="stat" fontWeight={600} minWidth={8}>
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
        <RestartIcon width={16} height={16} />
      </Button>

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
        onClick={toggleMute}
        title={isMuted ? 'Включить звук' : 'Выключить звук'}>
        {isMuted ? (
          <MuteIcon width={16} height={16} />
        ) : (
          <SoundIcon width={16} height={16} />
        )}
      </Button>

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
        onClick={toggleFullscreen}
        title={
          isFullscreen
            ? 'Выход из полноэкранного режима'
            : 'Полноэкранный режим'
        }>
        {isFullscreen ? (
          <ExitFullscreenIcon width={16} height={16} />
        ) : (
          <FullscreenIcon width={16} height={16} />
        )}
      </Button>
    </HStack>
  )
}
