import { Helmet } from 'react-helmet'

import { usePage } from '@/app/hooks/usePage'
import { Header } from '@/widgets/header'

import { initMainPage } from '../model/initMainPage'

export const MainPage = () => {
  usePage({ initPage: initMainPage })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>BugOrFeature</title>
        <meta name="description" content="BugOrFeature" />
      </Helmet>
      <Header />
      <h1>Hello, world!</h1>
    </div>
  )
}
