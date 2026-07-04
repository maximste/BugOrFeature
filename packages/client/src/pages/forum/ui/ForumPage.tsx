import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import { getTopics } from '@/shared/api'
import type { TopicResponse } from '@/shared/api'
import { PageHeading } from '@/shared/ui/page-heading'
import { ForumTopicsList } from '@/widgets/forum-topics-list'

import { initForumPage } from '../model/initForumPage'

import styles from './ForumPage.module.scss'

export const ForumPage = () => {
  usePage({ initPage: initForumPage })

  const [topics, setTopics] = useState<TopicResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getTopics()
      .then(data => {
        if (!cancelled) {
          setTopics(data)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Не удалось загрузить темы'
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>BugOrFeature</title>
        <meta name="description" content="BugOrFeature" />
      </Helmet>
      <section className={styles.page}>
        <div className={styles.header}>
          <PageHeading
            title="Форум"
            subtitle="Делитесь опытом и кото-историями"
          />
          <Link to="/forum/new" className={styles.newTopicButton}>
            + Новая тема
          </Link>
        </div>
        {loading ? (
          <p className={styles.status}>Загрузка…</p>
        ) : error != null ? (
          <p className={styles.status} role="alert">
            {error}
          </p>
        ) : (
          <ForumTopicsList topics={topics} />
        )}
      </section>
    </>
  )
}
