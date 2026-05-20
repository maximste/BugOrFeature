import { Helmet } from 'react-helmet'

import { usePage } from '@/app/hooks/usePage'

import { initGamePage } from '../model/initGamePage'

export const GamePage = () => {
  usePage({ initPage: initGamePage })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра — BugOrFeature</title>
        <meta name="description" content="Сапёр" />
      </Helmet>
      <h1>Сапёр</h1>
      <p>Игровое поле (заглушка)</p>
    </div>
  )
}
