import type { FormEvent } from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Flex, Text, Link as ChakraLink } from '@chakra-ui/react'

import LogoIcon from '@/assets/icons/logo.svg?react'
import { usePage } from '@/app/hooks/usePage'
import { signUp, toAuthError } from '@/shared/auth'
import { Button } from '@/shared/ui/button'
import { CardForm } from '@/shared/ui/card'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'
import {
  handleValidationBlur,
  handleValidationFocus,
  validateForm,
} from '@/shared/lib/validations'

import { initSignUpPage } from '../model/initSignUpPage'

export const SignUpPage = () => {
  usePage({ initPage: initSignUpPage })
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [login, setLogin] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { isValid, data } = validateForm(e.currentTarget)
    if (!isValid) {
      setLoading(false)
      return
    }

    try {
      await signUp({
        firstName: data.first_name,
        secondName: data.second_name,
        login: data.login,
        email: data.email,
        password: data.password,
        phone: data.phone,
      })
      navigate('/signin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : toAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex
      as="main"
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
      w="full">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация — Catsweeper</title>
        <meta name="description" content="Регистрация" />
      </Helmet>
      <CardForm
        display="flex"
        flexDirection="column"
        gap={4}
        w="full"
        maxW="26rem"
        p="35px 25px 25px"
        onSubmit={handleSubmit}
        onFocus={e => handleValidationFocus(e.nativeEvent)}
        onBlur={e => handleValidationBlur(e.nativeEvent)}
        noValidate>
        <Flex direction="column" alignItems="center" gap={1}>
          <Flex
            justifyContent="center"
            alignItems="center"
            w="56px"
            h="56px"
            borderRadius="16px"
            background="buttonBg/30">
            <LogoIcon width={28} height={28} />
          </Flex>
          <Text
            as="h2"
            m={0}
            fontFamily="body"
            fontSize="18px"
            fontWeight="700"
            lineHeight="28px"
            textAlign="center">
            Создать аккаунт
          </Text>
          <Text
            as="span"
            fontFamily="body"
            fontSize="12px"
            fontWeight="400"
            textAlign="center">
            Присоединяйтесь к пушистому сообществу
          </Text>
        </Flex>
        {error != null ? (
          <Text
            m={0}
            fontSize="14px"
            color="danger"
            textAlign="center"
            role="alert">
            {error}
          </Text>
        ) : null}
        <FormField label="Имя" htmlFor="signup-name">
          <Input
            id="signup-name"
            name="first_name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Барсик"
            autoComplete="given-name"
            disabled={loading}
          />
        </FormField>
        <FormField label="Фамилия" htmlFor="signup-lastname">
          <Input
            id="signup-lastname"
            name="second_name"
            value={secondName}
            onChange={e => setSecondName(e.target.value)}
            placeholder="Матроскин"
            autoComplete="family-name"
            disabled={loading}
          />
        </FormField>
        <FormField label="Логин" htmlFor="signup-login">
          <Input
            id="signup-login"
            name="login"
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="turbo_barsik"
            autoComplete="username"
            disabled={loading}
          />
        </FormField>
        <FormField label="Телефон" htmlFor="signup-phone">
          <Input
            id="signup-phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+79998887766"
            autoComplete="tel"
            disabled={loading}
          />
        </FormField>
        <FormField label="Email" htmlFor="signup-email">
          <Input
            id="signup-email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="cat@meow.com"
            autoComplete="email"
            disabled={loading}
          />
        </FormField>
        <FormField label="Пароль" htmlFor="signup-password">
          <Input
            id="signup-password"
            name="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="********"
            autoComplete="off"
            disabled={loading}
          />
        </FormField>
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={4}
          w="full">
          <Button type="submit" minW="full" disabled={loading}>
            {loading ? 'Регистрация…' : 'Зарегистрироваться'}
          </Button>
          <Text
            as="span"
            fontFamily="body"
            fontSize="12px"
            fontWeight="400"
            textAlign="center">
            Уже есть аккаунт?{' '}
            <ChakraLink asChild>
              <Link to="/signin">Войти</Link>
            </ChakraLink>
          </Text>
        </Flex>
      </CardForm>
      <Box
        fontFamily="body"
        fontSize="12px"
        fontWeight="400"
        textAlign="center">
        <ChakraLink
          asChild
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
          textDecoration="none">
          <Link to="/signin">
            <Box as="span">←</Box>
            Авторизоваться
          </Link>
        </ChakraLink>
      </Box>
    </Flex>
  )
}
