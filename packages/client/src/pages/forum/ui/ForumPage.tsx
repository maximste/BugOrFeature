import { Helmet } from 'react-helmet'

import { usePage } from '@/app/hooks/usePage'
import { Button } from '@/shared/ui/button'
import { PageHeading } from '@/shared/ui/page-heading'
import { Header } from '@/widgets/header'

import { initForumPage } from '../model/initForumPage'

import styles from './ForumPage.module.scss'

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
      <header className={styles.headingBlock}>
        <PageHeading
          title="Форум"
          subtitle="Делитесь опытом и кото-историями"
        />
        <Button type="button">+ Новая тема</Button>
      </header>
    </>
  )
}
