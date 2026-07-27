import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Text, Link as ChakraLink, Flex } from '@chakra-ui/react'

import LogoIcon from '@/assets/icons/logo.svg?react'
import { getOauthYandexServiceId, getUserTheme } from '@/shared/api'
import { fetchAuthUser, useDispatch } from '@/app/store'
import { signIn, toAuthError } from '@/shared/auth'
import {
  buildYandexOAuthAuthorizeUrl,
  getYandexOAuthRedirectUri,
} from '@/shared/config/oauth'
import { Button } from '@/shared/ui/button'
import { CardForm } from '@/shared/ui/card'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'
import { PageHeading } from '@/shared/ui/page-heading'
import {
  handleValidationBlur,
  handleValidationFocus,
  validateForm,
} from '@/shared/lib/validations'
import { useColorMode } from '@/app/providers'

export const SignInForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [signInLoading, setSignInLoading] = useState(false)
  const [yandexLoading, setYandexLoading] = useState(false)
  const loading = yandexLoading || signInLoading
  const displayError = error

  const { setColorMode } = useColorMode()

  const setUserTheme = async () => {
    const theme = await getUserTheme()
    if (theme) {
      const code = theme.themeCode

      if (code === 'light' || code === 'dark') {
        setColorMode(code)
      }
    }
  }

  const authOrRegisterFromYandex = async () => {
    setError(null)
    setYandexLoading(true)
    try {
      const REDIRECT_URI = getYandexOAuthRedirectUri()
      const { service_id: CLIENT_ID } = await getOauthYandexServiceId(
        REDIRECT_URI
      )
      const URL = buildYandexOAuthAuthorizeUrl(CLIENT_ID, REDIRECT_URI)

      document.location.href = URL
    } catch (err) {
      setError(toAuthError(err))
      setYandexLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSignInLoading(true)

    const { isValid, data } = validateForm(e.currentTarget)
    if (!isValid) {
      setSignInLoading(false)
      return
    }

    try {
      await signIn(login, password)
      await dispatch(fetchAuthUser()).unwrap()

      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : toAuthError(err))
    } finally {
      setSignInLoading(false)
      setUserTheme()
    }
  }

  return (
    <CardForm
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      gap={4}
      w="full"
      maxW="26rem"
      p="30px"
      onSubmit={handleSubmit}
      onFocus={e => handleValidationFocus(e.nativeEvent)}
      onBlur={e => handleValidationBlur(e.nativeEvent)}
      noValidate>
      <Flex
        justifyContent="center"
        alignItems="center"
        w="56px"
        h="56px"
        mx="auto"
        borderRadius="16px"
        background="buttonBg/30">
        <LogoIcon width={28} height={28} />
      </Flex>
      <PageHeading
        title="С возвращением"
        subtitle="Войдите, чтобы общаться на форуме"
        align="center"
        gap={1}
        textAlign="center"
        mb="4px"
        titleFontSize="24px"
        subtitleFontSize="14px"
      />
      {!displayError ? null : (
        <Text
          m={0}
          fontSize="14px"
          color="danger"
          textAlign="center"
          role="alert">
          {displayError}
        </Text>
      )}
      <FormField label="Логин" htmlFor="login" width="100%">
        <Input
          id="login"
          name="login"
          type="text"
          value={login}
          onChange={e => setLogin(e.target.value)}
          placeholder="cat"
          autoComplete="username"
          disabled={loading}
          width="100%"
        />
      </FormField>
      <FormField label="Пароль" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="off"
          disabled={loading}
        />
      </FormField>
      <Button
        type="submit"
        w="full"
        maxW="none"
        mt="4px"
        padding="12px 16px"
        disabled={loading}>
        {signInLoading ? 'Вход…' : 'Войти'}
      </Button>
      <Text
        alignSelf="center"
        m="4px 0 0"
        fontSize="14px"
        color="subtitleText"
        textAlign="center">
        Нет аккаунта?{' '}
        <ChakraLink
          asChild
          color="text"
          fontWeight="600"
          textDecoration="none"
          _hover={{ color: 'danger' }}>
          <Link to="/signup">Зарегистрироваться</Link>
        </ChakraLink>
      </Text>
      <Text
        display="flex"
        justifyContent="center"
        fontSize="14px"
        color="text"
        fontWeight="600"
        cursor="pointer"
        _hover={{ color: 'danger' }}
        onClick={loading ? undefined : authOrRegisterFromYandex}
        aria-disabled={loading}>
        {yandexLoading ? 'Вход через Яндекс…' : 'Войти через Яндекс'}
      </Text>
    </CardForm>
  )
}
