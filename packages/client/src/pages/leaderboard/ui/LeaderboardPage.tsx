import { Helmet } from 'react-helmet-async'

import { usePage } from '@/app/hooks/usePage'

import { initLeaderboardPage } from '../model/initLeaderboardPage'

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Таблица лидеров" />
      </Helmet>
      <h1>Лидерборд</h1>
      <p>Таблица лидеров (заглушка)</p>
    </div>
  )
}
