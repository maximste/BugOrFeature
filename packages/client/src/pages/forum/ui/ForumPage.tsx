import { Helmet } from 'react-helmet'

import { usePage } from '@/app/hooks/usePage'
import { Header } from '@/widgets/header'

import { initForumPage } from '../model/initForumPage'

export const ForumPage = () => {
  usePage({ initPage: initForumPage })

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>BugOrFeature</title>
        <meta name="description" content="BugOrFeature" />
      </Helmet>
      <Header />
      <h1>Hello, world!</h1>
    </>
  )
}
