import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '@/app/providers'
import { signIn, toAuthError } from '@/shared/auth'
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
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(login, password)
      refreshAuth()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : toAuthError(err))
    } finally {
      setLoading(false)
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
      {!error ? null : (
        <p className={styles.error} role="alert">
          {error}
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
        {loading ? 'Вход…' : 'Войти'}
      </Button>
      <p className={styles.footer}>
        Нет аккаунта?{' '}
        <Link className={styles.registerLink} to="/signup">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  )
}
