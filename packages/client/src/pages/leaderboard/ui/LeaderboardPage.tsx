import styles from './LeaderboardPage.module.scss'
import { Helmet } from 'react-helmet'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePage } from '@/app/hooks/usePage'

import { initLeaderboardPage } from '../model/initLeaderboardPage'
import { Button } from '@/shared/ui/button'
import { PageHeading } from '@/shared/ui/page-heading'
import { Table } from '@/shared/ui/table'

import { getLeaderbordData } from '@/shared/api/apiClient'
import { LeaderboardUnit } from '@/entities/leaderbord'
import { TDifficulty } from '@/pages/game/types/game'

const LEVEL_BUTTONS: { label: string; level: Level }[] = [
  { label: 'Котенок', level: 'easy' },
  { label: 'Кот', level: 'medium' },
  { label: 'Дикий кот', level: 'hard' },
]

const tableColumns = [
  {
    key: 'rating',
    title: 'Место',
  },
  {
    key: 'playerEl',
    title: 'Игрок',
  },
  {
    key: 'timeStr',
    title: 'Результат',
  },
]

type Level = TDifficulty

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage })

  const [activeLevel, setActiveLevel] = useState<Level>('easy')
  const [leadersData, setLeadersData] = useState<LeaderboardUnit[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderbordData(activeLevel)

        setLeadersData(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [activeLevel])

  const tableRows = useMemo(
    () =>
      leadersData.map((el, i) => ({
        ...el,
        playerEl: <div className={styles.playerFlex}>{el.data.player}</div>,
        rating: i + 1,
        timeStr: `${el.data.time} сек`,
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
                className={`${styles.tab} ${
                  activeLevel === level ? styles.tab_active : ''
                }`.trim()}
                onClick={() => setActiveLevel(level)}>
                {label}
              </Button>
            </li>
          ))}
        </ul>

        <Table
          className={styles.table}
          columns={tableColumns}
          rows={tableRows}
        />
      </section>
    </>
  )
}
