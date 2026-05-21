import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'

import { initForumTopicPage } from '../model/initForumTopicPage'

export const ForumTopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>()
  usePage({ initPage: initForumTopicPage })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Топик — BugOrFeature</title>
        <meta name="description" content="Топик форума" />
      </Helmet>
      <h1>Топик форума</h1>
      <p>ID топика: {topicId}</p>
    </div>
  )
}
