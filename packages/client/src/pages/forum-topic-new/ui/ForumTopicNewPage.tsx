import { Helmet } from 'react-helmet'
import { Box } from '@chakra-ui/react'

import { usePage } from '@/app/hooks/usePage'
import { CreateTopicForm } from '@/features/create-topic'
import { BackLink } from '@/shared/ui/back-link'
import { PageHeading } from '@/shared/ui/page-heading'

import { initForumTopicNewPage } from '../model/initForumTopicNewPage'

export const ForumTopicNewPage = () => {
  usePage({ initPage: initForumTopicNewPage })

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Новая тема — BugOrFeature</title>
        <meta name="description" content="Создать тему на форуме" />
      </Helmet>
      <Box as="section" w="full" maxW="660px" mx="auto">
        <BackLink to="/forum" alignSelf="start">
          ← К темам
        </BackLink>
        <PageHeading title="Новая тема" margin="14px 0" />
        <CreateTopicForm />
      </Box>
    </>
  )
}
