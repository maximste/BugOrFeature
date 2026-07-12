import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { Box, Flex, Text } from '@chakra-ui/react'

import { usePage } from '@/app/hooks/usePage'
import { getTopics } from '@/shared/api'
import type { TopicResponse } from '@/shared/api'
import { Button } from '@/shared/ui/button'
import { PageHeading } from '@/shared/ui/page-heading'
import { ForumTopicsList } from '@/widgets/forum-topics-list'

import { initForumPage } from '../model/initForumPage'

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
      <Box as="section" w="full" maxW="660px" mx="auto">
        <Flex justifyContent="space-between" alignItems="center" mb="32px">
          <PageHeading
            title="Форум"
            subtitle="Делитесь опытом и кото-историями"
          />
          <Button asChild variant="default">
            <Link to="/forum/new">+ Новая тема</Link>
          </Button>
        </Flex>
        {loading ? (
          <Text color="text">Загрузка…</Text>
        ) : error != null ? (
          <Text color="danger" role="alert">
            {error}
          </Text>
        ) : (
          <ForumTopicsList topics={topics} />
        )}
      </Box>
    </>
  )
}
