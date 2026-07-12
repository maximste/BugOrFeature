import { Helmet } from 'react-helmet'
import { Flex } from '@chakra-ui/react'

import { usePage } from '@/app/hooks/usePage'
import { SignInForm } from '@/features/sign-in'
import { BackLink } from '@/shared/ui/back-link'

import { initSignInPage } from '../model/initSignInPage'

export const SignInPage = () => {
  usePage({ initPage: initSignInPage })

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход — Catsweeper</title>
        <meta name="description" content="Войдите, чтобы общаться на форуме" />
      </Helmet>
      <Flex
        as="section"
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={5}
        w="full"
        minH="calc(100vh - 120px)"
        padding="24px 16px 48px">
        <SignInForm />
        <BackLink />
      </Flex>
    </>
  )
}
