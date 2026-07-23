import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { Box, Flex, Text } from '@chakra-ui/react'

import { usePage } from '@/app/hooks/usePage'
import { deleteTopic, getTopics, type TopicResponse } from '@/shared/api'
import { Button } from '@/shared/ui/button'
import { PageHeading } from '@/shared/ui/page-heading'
import { ForumTopicsList } from '@/widgets/forum-topics-list'

import { initForumPage } from '../model/initForumPage'

const PAGE_SIZE = 10

export const ForumPage = () => {
  usePage({ initPage: initForumPage })

  const [topics, setTopics] = useState<TopicResponse[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getTopics(page, PAGE_SIZE)
      .then(data => {
        if (!cancelled) {
          setTopics(data.items)
          setTotal(data.total)
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
  }, [page])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleDeleteTopic = async (id: string) => {
    try {
      await deleteTopic(id)

      const isLastItemOnPage = topics.length === 1 && page > 1
      const nextPage = isLastItemOnPage ? page - 1 : page
      const data = await getTopics(nextPage, PAGE_SIZE)

      setTopics(data.items)
      setTotal(data.total)
      setPage(nextPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить тему')
    }
  }

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
          <>
            <ForumTopicsList
              topics={topics}
              onDeleteTopic={handleDeleteTopic}
            />
            {totalPages > 1 ? (
              <Flex
                justifyContent="center"
                alignItems="center"
                gap={3}
                mt="24px">
                <Button
                  variant="white"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}>
                  ← Назад
                </Button>
                <Text color="subtitleText" fontSize="14px">
                  Страница {page} из {totalPages}
                </Text>
                <Button
                  variant="white"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}>
                  Вперёд →
                </Button>
              </Flex>
            ) : null}
          </>
        )}
      </Box>
    </>
  )
}
