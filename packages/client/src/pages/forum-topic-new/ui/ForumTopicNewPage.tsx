import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import { CreateTopicForm } from '@/features/create-topic'
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
        <Link className={styles.back} to="/forum">
          ← К темам
        </Link>
        <PageHeading title="Новая тема" className={styles.title} />
        <CreateTopicForm />
      </section>
    </>
  )
}
