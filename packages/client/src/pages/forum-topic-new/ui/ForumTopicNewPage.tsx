import { Helmet } from 'react-helmet'

import { usePage } from '@/app/hooks/usePage'
import { CreateTopicForm } from '@/features/create-topic'
import { BackLink } from '@/shared/ui/back-link'
import { PageHeading } from '@/shared/ui/page-heading'

import { initForumTopicNewPage } from '../model/initForumTopicNewPage'

import styles from './ForumTopicNewPage.module.scss'

export const ForumTopicNewPage = () => {
  usePage({ initPage: initForumTopicNewPage })

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Новая тема — BugOrFeature</title>
        <meta name="description" content="Создать тему на форуме" />
      </Helmet>
      <section className={styles.page}>
        <BackLink to="/forum">← К темам</BackLink>
        <PageHeading title="Новая тема" className={styles.title} />
        <CreateTopicForm />
      </section>
    </>
  )
}
