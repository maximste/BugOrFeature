import { Helmet } from 'react-helmet'
import { useEffect, useMemo, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { usePage } from '@/app/hooks/usePage'

import FishIcon from '@/assets/icons/fish.svg?react'
import CupIcon from '@/assets/icons/cup.svg?react'
import { initLeaderboardPage } from '../model/initLeaderboardPage'
import { Button } from '@/shared/ui/button'
import { PageHeading } from '@/shared/ui/page-heading'
import { Table } from '@/shared/ui/table'

import { getLeaderboardData, LeaderboardUnit } from '@/entities/leaderboard'
import { TDifficulty } from '@/pages/game/types/game'

const LEVEL_BUTTONS: { label: string; level: Level }[] = [
  { label: 'Котенок', level: 'easy' },
  { label: 'Кот', level: 'medium' },
  { label: 'Дикий кот', level: 'hard' },
]

const RANK_BACKGROUND: Record<number, string> = {
  0: 'mint/40',
  1: 'purple/40',
  2: 'pink/40',
}

const rankCellProps = (rowIndex: number) => ({
  width: '60px',
  textAlign: 'right' as const,
  fontFamily: 'fredoka',
  fontWeight: '800',
  ...(rowIndex < 3
    ? {
        fontSize: 0,
        backgroundImage: `url('/img/rating${rowIndex + 1}-icon.png')`,
        backgroundPosition: 'right 16px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '16px auto',
      }
    : {}),
})

const tableColumns = [
  {
    key: 'rating',
    title: 'Место',
    cellProps: (_row: unknown, rowIndex: number) => rankCellProps(rowIndex),
  },
  {
    key: 'playerEl',
    title: 'Игрок',
  },
  {
    key: 'timeStr',
    title: 'Результат',
    cellProps: { textAlign: 'right' as const },
  },
]

type Level = TDifficulty

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage })

  const [activeLevel, setActiveLevel] = useState<Level>('easy')
  const [leadersData, setLeadersData] = useState<LeaderboardUnit[]>([])
  const [noDataText, setNoDataText] = useState<string>('')

  useEffect(() => {
    setNoDataText('')
    const fetchData = async () => {
      try {
        const rawData = await getLeaderboardData()
        const data = rawData.filter(el => el.data.level === activeLevel)

        setLeadersData(data)
        if (!data.length) {
          setNoDataText(
            'Пока рекордов нет. Будьте первым! Но помните - один рекорд в одни лапки 🐾! Независимо от уровня.'
          )
        }
      } catch (err) {
        console.error(err)
        setNoDataText('Не удалось загрузить данные')
      }
    }

    fetchData()
  }, [activeLevel])

  const tableRows = useMemo(
    () =>
      leadersData.map((el, i) => ({
        ...el,
        playerEl: (
          <Flex alignItems="center" gap={4} fontSize="16px" fontWeight="700">
            <FishIcon width={16} height={16} />
            {el.data.player}
          </Flex>
        ),
        rating: i + 1,
        timeStr: `${Math.abs(el.data.BOFTime)} сек`,
      })),
    [leadersData]
  )

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Таблица лидеров" />
      </Helmet>
      <Box as="section" w="full" maxW="660px" mx="auto">
        <Box mb="32px">
          <Text
            display="flex"
            alignItems="center"
            gap={2}
            cursor="text"
            fontFamily="body"
            fontSize="14px"
            fontWeight="500"
            background="purple/50"
            padding="6px 16px"
            borderRadius="pill"
            color="buttonText"
            maxW="max-content"
            margin="0 auto 24px">
            <CupIcon />
            Зал котославы
          </Text>
          <PageHeading
            title="Топ игроков"
            subtitle="Самые быстрые лапки в каждом уровне."
            alignItems="center"
          />
        </Box>

        <Flex
          as="ul"
          listStyleType="none"
          gap={3}
          justifyContent="center"
          mb="24px">
          {LEVEL_BUTTONS.map(({ label, level }) => (
            <Box as="li" key={level}>
              <Button
                variant={activeLevel === level ? 'solid' : 'cyan'}
                onClick={() => setActiveLevel(level)}>
                {label}
              </Button>
            </Box>
          ))}
        </Flex>

        <Table
          columns={tableColumns}
          rows={tableRows}
          getRowProps={(_row, rowIndex) => {
            const background = RANK_BACKGROUND[rowIndex]
            return background ? { background } : {}
          }}
        />
        <Text textAlign="center">{noDataText}</Text>
      </Box>
    </>
  )
}
