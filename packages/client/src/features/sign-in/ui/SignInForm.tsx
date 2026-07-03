import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '@/app/providers'
import { getOauthYandexServiceId } from '@/shared/api'
import { signIn, toAuthError } from '@/shared/auth'
import {
  buildYandexOAuthAuthorizeUrl,
  getYandexOAuthRedirectUri,
} from '@/shared/config/oauth'
import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'
import { PageHeading } from '@/shared/ui/page-heading'

import styles from './SignInForm.module.scss'

export const SignInForm = () => {
  const navigate = useNavigate()
  const { refreshAuth } = useAuth()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [signInLoading, setSignInLoading] = useState(false)
  const [yandexLoading, setYandexLoading] = useState(false)
  const loading = yandexLoading || signInLoading
  const displayError = error

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

    try {
      await signIn(login, password)
      refreshAuth()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : toAuthError(err))
    } finally {
      setSignInLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.iconWrap} aria-hidden>
        <img className={styles.icon} src="/icons/logo.svg" alt="" />
      </div>
      <PageHeading
        title="С возвращением"
        subtitle="Войдите, чтобы общаться на форуме"
        className={styles.heading}
      />
      {!displayError ? null : (
        <p className={styles.error} role="alert">
          {displayError}
        </p>
      )}
      <FormField label="Логин" htmlFor="login">
        <Input
          id="login"
          name="login"
          type="text"
          className={styles.input}
          value={login}
          onChange={e => setLogin(e.target.value)}
          placeholder="cat"
          autoComplete="username"
          disabled={loading}
        />
      </FormField>
      <FormField label="Пароль" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          className={styles.input}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="off"
          disabled={loading}
        />
      </FormField>
      <Button type="submit" className={styles.submit} disabled={loading}>
        {signInLoading ? 'Вход…' : 'Войти'}
      </Button>
      <p className={styles.footer}>
        Нет аккаунта?{' '}
        <Link className={styles.registerLink} to="/signup">
          Зарегистрироваться
        </Link>
      </p>
      <p
        className={styles.authYandexLink}
        onClick={loading ? undefined : authOrRegisterFromYandex}
        aria-disabled={loading}>
        {yandexLoading ? 'Вход через Яндекс…' : 'Войти через Яндекс'}
      </p>
    </form>
  )
}
