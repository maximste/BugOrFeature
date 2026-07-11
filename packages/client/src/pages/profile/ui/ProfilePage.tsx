import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { Box, Text, Link as ChakraLink } from '@chakra-ui/react'

import { usePage } from '@/app/hooks/usePage'
import { useAuth } from '@/app/providers'
import {
  fetchAuthUser,
  selectAuthStatus,
  selectAuthUser,
  selectIsAuthUserLoading,
  setUser,
  useDispatch,
  useSelector,
} from '@/app/store'
import { ProfileView } from '@/widgets/profile-view'
import { BackLink } from '@/shared/ui/back-link'
import { Card } from '@/shared/ui/card'
import { PageHeading } from '@/shared/ui/page-heading'

import { useIsOffline } from '../hooks/useIsOffline'
import { initProfilePage } from '../model/initProfilePage'
import {
  toProfileLoadError,
  type ProfileLoadError,
} from '../model/profileLoadError'

export const ProfilePage = () => {
  const { isAuthenticated } = useAuth()
  const dispatch = useDispatch()
  const user = useSelector(selectAuthUser)
  const authStatus = useSelector(selectAuthStatus)
  const isAuthUserLoading = useSelector(selectIsAuthUserLoading)

  usePage({ initPage: initProfilePage })

  const isOffline = useIsOffline()
  const [loadError, setLoadError] = useState<ProfileLoadError | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    if (user != null || isAuthUserLoading) {
      return
    }

    if (authStatus === 'failed') {
      setLoadError({
        message: 'Не удалось загрузить профиль. Попробуйте войти снова.',
        showSignInHint: true,
      })
      return
    }

    dispatch(fetchAuthUser())
      .unwrap()
      .catch(err => setLoadError(toProfileLoadError(err)))
  }, [isAuthenticated, user, isAuthUserLoading, authStatus, dispatch])

  const loading = isAuthenticated && user == null && isAuthUserLoading

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль — BugOrFeature</title>
        <meta name="description" content="Страница пользователя BugOrFeature" />
      </Helmet>
      <Box as="section" maxW="660px" mx="auto" w="full">
        <BackLink to="/">← На главную</BackLink>
        <PageHeading title="Профиль" margin="14px 0 8px" />

        {loading ? (
          <Text
            fontFamily="body"
            fontSize="15px"
            fontWeight="500"
            margin="16px 0 0"
            color="subtitleText">
            Загрузка профиля…
          </Text>
        ) : null}

        {!loading && loadError != null ? (
          <Card
            p="20px"
            border="1px solid"
            borderColor="border"
            mt="16px"
            role="alert">
            <Text
              fontFamily="body"
              fontSize="14px"
              fontWeight="500"
              m={0}
              color="danger">
              {loadError.message}
            </Text>
            {loadError.showSignInHint ? (
              <Text
                fontFamily="body"
                fontSize="13px"
                fontWeight="400"
                margin="10px 0 0"
                color="text">
                <ChakraLink asChild fontWeight="700" color="text">
                  <Link to="/signin">Войдите</Link>
                </ChakraLink>
                , если вы ещё не авторизованы.
              </Text>
            ) : null}
          </Card>
        ) : null}

        {!loading && user != null ? (
          <>
            {isOffline ? (
              <Text
                fontFamily="body"
                fontSize="15px"
                fontWeight="500"
                margin="16px 0 0"
                color="subtitleText"
                role="status">
                Нет сети — сохранение изменений недоступно.
              </Text>
            ) : null}
            <ProfileView
              profile={user}
              onProfileChange={profile => dispatch(setUser(profile))}
            />
          </>
        ) : null}
      </Box>
    </>
  )
}
