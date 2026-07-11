import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import { BackLink } from '@/shared/ui/back-link'
import { ForumTopicView } from '@/widgets/forum-topic-view'

import { getForumTopicDetailMock } from '../model/mockForumTopicData'
import { initForumTopicPage } from '../model/initForumTopicPage'
import { Box } from '@chakra-ui/react'

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
        <BackLink to="/forum">← К темам</BackLink>
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
      <Box as="section" w="full" maxW="660px" mx="auto">
        <ForumTopicView topic={topic} comments={comments} />
      </Box>
    </>
  )
}
