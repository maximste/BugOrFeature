import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import { ForumTopicView } from '@/widgets/forum-topic-view'

import { getForumTopicDetailMock } from '../model/mockForumTopicData'
import { initForumTopicPage } from '../model/initForumTopicPage'

export const ForumTopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>()
  usePage({ initPage: initForumTopicPage })

  const data = getForumTopicDetailMock(topicId)

  if (!data) {
    return (
      <section>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Топик не найден — BugOrFeature</title>
          <meta name="description" content="Топик не найден" />
        </Helmet>
        <p>Топик не найден.</p>
        <Link to="/forum">← К темам</Link>
      </section>
    )
  }

  const { topic, comments } = data

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{topic.title} — BugOrFeature</title>
        <meta name="description" content={topic.description} />
      </Helmet>
      <ForumTopicView topic={topic} comments={comments} />
    </>
  )
}
