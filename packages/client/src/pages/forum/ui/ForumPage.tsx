import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'

import { usePage } from '@/app/hooks/usePage'
import type { Topic } from '@/entities/topic'
import { Button } from '@/shared/ui/button'
import { PageHeading } from '@/shared/ui/page-heading'
import { ForumTopicsList } from '@/widgets/forum-topics-list'
import { initForumPage } from '../model/initForumPage'

const MOCK_TOPICS: Topic[] = [
  {
    id: '1',
    title: 'Топик номер три',
    description: 'Какой-то насущный вопрос',
    author: 'Барсик',
    date: '2026-05-13',
  },
  {
    id: '2',
    title: 'Топик номер два',
    description: 'Очень смешной анекдот',
    author: 'Рыжик',
    date: '2026-05-13',
  },
  {
    id: '3',
    title: 'Топик номер один',
    description: 'Подробнее о главном.',
    author: 'Мурзик',
    date: '2026-05-13',
  },
  {
    id: '4',
    title: 'Без комментариев (демо)',
    description: 'Пустой список для проверки UI.',
    author: 'Мурзик',
    date: '2026-05-13',
  },
]

export const ForumPage = () => {
  usePage({ initPage: initForumPage })

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
        <ForumTopicsList topics={MOCK_TOPICS} />
      </Box>
    </>
  )
}
