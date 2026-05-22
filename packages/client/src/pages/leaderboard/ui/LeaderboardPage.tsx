import styles from './LeaderboardPage.module.scss'
import { Helmet } from 'react-helmet'

import { usePage } from '@/app/hooks/usePage'

import { initLeaderboardPage } from '../model/initLeaderboardPage'
import { Button } from '@/shared/ui/button'
import { PageHeading } from '@/shared/ui/page-heading'
import { Table } from '@/shared/ui/table'
import { useEffect, useState } from 'react'

const MOCK_DATA_SIMPLE = [
  {
    player: 'Мурзик',
    time: 69,
  },
  {
    player: 'Барсик',
    time: 72,
  },
  {
    player: 'Рыжик',
    time: 151,
  },
  {
    player: 'Мурка',
    time: 161,
  },
  {
    player: 'Шапокляк',
    time: 170,
  },
  {
    player: 'Гена',
    time: 180,
  },
]

const MOCK_DATA_MEDIUM = [
  {
    player: 'Кот',
    time: 50,
  },
  {
    player: 'Шарик',
    time: 72,
  },
  {
    player: 'Матроскин',
    time: 151,
  },
  {
    player: 'Мурка',
    time: 161,
  },
]

const MOCK_DATA_HARD = [
  {
    player: 'Барбос',
    time: 47,
  },
  {
    player: 'Тузик',
    time: 72,
  },
  {
    player: 'Рыжик',
    time: 151,
  },
  {
    player: 'Бобик',
    time: 161,
  },
]

const LEVEL_DATA_MAP = {
  Simple: MOCK_DATA_SIMPLE,
  Medium: MOCK_DATA_MEDIUM,
  Hard: MOCK_DATA_HARD,
}

type Level = keyof typeof LEVEL_DATA_MAP

export const LeaderboardPage = () => {
  const LEVEL_BUTTONS: { label: string; level: Level }[] = [
    { label: 'Котенок', level: 'Simple' },
    { label: 'Кот', level: 'Medium' },
    { label: 'Дикий кот', level: 'Hard' },
  ]

  const tableColumns = [
    {
      key: 'rating',
      title: 'Место',
    },
    {
      key: 'player',
      title: 'Игрок',
    },
    {
      key: 'timeStr',
      title: 'Результат',
    },
  ]

  usePage({ initPage: initLeaderboardPage })

  const [activeLevel, setActiveLevel] = useState<Level>('Simple')
  const [leadersData, setLeadersData] = useState<typeof MOCK_DATA_SIMPLE>([])

  useEffect(() => {
    const data = LEVEL_DATA_MAP[activeLevel].map((el, i) => {
      const newEl = {
        ...el,
        rating: i + 1,
        timeStr: `${el.time} сек`,
      }
      return newEl
    })

    setLeadersData(data || [])
  }, [activeLevel])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Таблица лидеров" />
      </Helmet>
      <section className={styles.pageSection}>
        <div className={styles.pageTop}>
          <h2 className={styles.subHeader}>Зал котославы</h2>
          <PageHeading
            className={styles.headerBlock}
            title="Топ игроков"
            subtitle="Самые быстрые лапки в каждом уровне."
          />
        </div>

        <ul className={styles.tabsList}>
          {LEVEL_BUTTONS.map(({ label, level }) => (
            <li key={level}>
              <Button
                className={`${styles.tab}${
                  activeLevel === level ? '_active' : ''
                }`}
                onClick={() => setActiveLevel(level)}>
                {label}
              </Button>
            </li>
          ))}
        </ul>

        <Table
          className={styles.table}
          columns={tableColumns}
          rows={leadersData}
        />
      </section>
    </>
  )
}
