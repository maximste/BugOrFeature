import { Helmet } from 'react-helmet'
import styles from './GamePage.module.scss'
import { usePage } from '@/app/hooks/usePage'

import { initGamePage } from '../model/initGamePage'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TDifficulty } from '../types/game'
import { useMinesweeper } from '../hooks/useMinesweeper'
import { useGameAudio } from '../hooks/useGameAudio'
import { Box, Heading, Button, Text, Flex } from '@chakra-ui/react'
import { ControlPanel } from './ControlPanel'
import MinesweeperCanvas from './MinesweeperCanvas'
import { GameStatusBanner } from './GameStatusBanner'
import { DEFAULT_DIFFICULTY } from '../constants/game'
import { exitFullscreenMode, setFullscreenMode } from '@/shared/fullscreen'
import { store } from '@/app/store'
import { sendResultToLeaderbord } from '@/entities/leaderbord'

export const GamePage = () => {
  usePage({ initPage: initGamePage })

  const [currentDifficulty, setCurrentDifficulty] =
    useState<TDifficulty>('easy')
  const [customConfig, setCustomConfig] = useState(DEFAULT_DIFFICULTY)

  const onCustomStart = (rows: number, cols: number, mines: number) => {
    setCustomConfig({ rows, cols, mines })
    setCurrentDifficulty('custom')
  }

  const {
    grid,
    rows,
    cols,
    status,
    minesLeft,
    time,
    reveal,
    flag,
    chord,
    reset,
    tick,
    cheat,
  } = useMinesweeper(currentDifficulty, customConfig)

  const { isMuted, toggleMute } = useGameAudio(status)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (status === 'playing') timerRef.current = setInterval(tick, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status, tick])

  //Полный экран
  //html-элемент, который идет на полный экран
  const fullscreenRef = useRef<HTMLDivElement | null>(null)
  //не разрешаем многократную установку обработчика событий.
  const isEventListenerSet = useRef(false)

  //для отображения состояний кнопки, смены стилей обертки
  const [isFullscreen, setIsFullscreen] = useState(false)

  //само переключение
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      setFullscreenMode(fullscreenRef.current)
    } else {
      exitFullscreenMode()
    }
  }, [isFullscreen])

  //колбэк обработчика
  const handleFullScreenChange = useCallback(() => {
    const isActive = !!document.fullscreenElement
    setIsFullscreen(isActive)
  }, [])

  // Установка слушателя событий
  useEffect(() => {
    if (!isEventListenerSet.current) {
      const eventName = 'fullscreenchange'
      document.addEventListener(eventName, handleFullScreenChange)
      isEventListenerSet.current = true

      return () => {
        document.removeEventListener(eventName, handleFullScreenChange)
      }
    }
  }, [handleFullScreenChange])

  //отправить в лидерборд
  useEffect(() => {
    if (status === 'won') {
      const gameData = {
        player: store.getState().auth.user?.login,
        level: currentDifficulty,
        BOFTime: time * -1,
      }
      sendResultToLeaderbord(gameData)
    }
  }, [status])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Котосапёр</title>
        <meta name="description" content="Игра Котосапёр" />
      </Helmet>

      <Heading fontSize="2rem" fontWeight={800}>
        Котосапёр 🐾
      </Heading>
      <Text mt={1}>Не разбудите пёсиков и соберите всех котиков</Text>
      <Flex
        direction="column"
        align="center"
        className={isFullscreen ? styles.fullscreenWrapper : ''}
        ref={fullscreenRef}>
        <ControlPanel
          currentDifficulty={currentDifficulty}
          setCurrentDifficulty={setCurrentDifficulty}
          onCustomStart={onCustomStart}
          minesLeft={minesLeft}
          time={time}
          reset={reset}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />

        <GameStatusBanner status={status} onReset={reset} />

        <Box
          border="12px solid white"
          borderRadius="2xl"
          overflow="hidden"
          maxW="100%"
          overflowX="auto"
          shadow="card">
          <MinesweeperCanvas
            grid={grid}
            rows={rows}
            cols={cols}
            status={status}
            onReveal={reveal}
            onFlag={flag}
            onChord={chord}
          />
        </Box>
      </Flex>
      <Text
        maxW="28rem"
        fontWeight={400}
        fontSize="0.875rem"
        mt={4}
        textAlign="center">
        Клик — открыть клетку. Правый клик — поставить рыбку-флажок. Не
        разбудите спящих пёсиков!
      </Text>

      {/* TODO: убрать после тестирования */}
      <Button onClick={cheat} mt={8} opacity={0.4}>
        победить (debug)
      </Button>
    </>
  )
}
