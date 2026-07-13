import { Helmet } from 'react-helmet'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Flex, Text } from '@chakra-ui/react'

import { usePage } from '@/app/hooks/usePage'
import { fetchAuthUser, useDispatch } from '@/app/store'
import { oauthYandex } from '@/shared/api'
import { toAuthError } from '@/shared/auth'
import { getYandexOAuthRedirectUri } from '@/shared/config/oauth'

import { initOauthPage } from '../model/initOauthPage'

export const OauthPage = () => {
  usePage({ initPage: initOauthPage })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const [error, setError] = useState<string | null>(null)
  const processedCode = useRef<string | null>(null)

  useEffect(() => {
    if (!code || processedCode.current === code) return

    processedCode.current = code
    setError(null)

    const redirectUri = getYandexOAuthRedirectUri()

    oauthYandex({ code, redirect_uri: redirectUri })
      .then(async () => {
        await dispatch(fetchAuthUser()).unwrap()
        window.history.replaceState({}, '', '/oauth/')
        navigate('/', { replace: true })
      })
      .catch(err => {
        window.history.replaceState({}, '', '/oauth/')
        setError(toAuthError(err))
      })
  }, [code, dispatch, navigate])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Авторизация — Catsweeper</title>
      </Helmet>
      <Flex
        as="section"
        justifyContent="center"
        alignItems="center"
        minH="40vh"
        p="24px">
        {!error ? (
          <Text m={0} fontSize="16px">
            Завершаем вход через Яндекс…
          </Text>
        ) : (
          <Text m={0} fontSize="16px" color="danger" role="alert">
            {error}
          </Text>
        )}
      </Flex>
    </>
  )
}
