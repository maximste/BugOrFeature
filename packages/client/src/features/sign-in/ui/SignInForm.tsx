import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'
import { PageHeading } from '@/shared/ui/page-heading'

import styles from './SignInForm.module.scss'

export const SignInForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
      <FormField label="Email" htmlFor="signin-email">
        <Input
          id="signin-email"
          name="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="cat@meow.com"
          autoComplete="email"
        />
      </FormField>
      <FormField label="Пароль" htmlFor="signin-password">
        <Input
          id="signin-password"
          name="password"
          type="password"
          className={styles.input}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </FormField>
      <Button type="submit" className={styles.submit}>
        Войти
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
