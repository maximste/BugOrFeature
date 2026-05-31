import type { FormEvent } from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import { signUp, toAuthError } from '@/shared/auth'
import { useRequireAuth } from '@/shared/hooks'
import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'

import { initSignUpPage } from '../model/initSignUpPage'

import styles from './SignUpPage.module.scss'

export const SignUpPage = () => {
  useRequireAuth('guest')
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

    try {
      await signUp({
        firstName,
        secondName,
        login,
        email,
        password,
        phone,
      })
      navigate('/signin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : toAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация — Catsweeper</title>
        <meta name="description" content="Регистрация" />
      </Helmet>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.titleContainer}>
          <div className={styles.titleIconContainer}>
            <img src="/img/signup-icon.png" alt="" />
          </div>
          <h2 className={styles.title}>Создать аккаунт</h2>
          <span className={styles.titleSubtitle}>
            Присоединяйтесь к пушистому сообществу
          </span>
        </div>
        {error != null ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
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
        <div className={styles.formFooter}>
          <Button
            className={styles.formFooterButton}
            type="submit"
            disabled={loading}>
            {loading ? 'Регистрация…' : 'Зарегистрироваться'}
          </Button>
          <span className={styles.formFooterDescription}>
            Уже есть аккаунт? <Link to="/signin">Войти</Link>
          </span>
        </div>
      </form>
      <div className={styles.footer}>
        <Link className={styles.footerLink} to="/signin">
          <span className={styles.footerLinkIcon}>←</span>
          Авторизоваться
        </Link>
      </div>
    </main>
  )
}
