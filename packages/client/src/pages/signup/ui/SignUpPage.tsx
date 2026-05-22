import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import styles from './SignUpPage.module.scss'

import { usePage } from '@/app/hooks/usePage'

import { initSignUpPage } from '../model/initSignUpPage'
import { Input } from '@/shared/ui/input'
import { FormField } from '@/shared/ui/form-field'
import { Button } from '@/shared/ui/button'

export const SignUpPage = () => {
  usePage({ initPage: initSignUpPage })
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [login, setLogin] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация — Catsweeper</title>
        <meta name="description" content="Регистрация" />
      </Helmet>
      <form
        className={styles.form}
        onSubmit={() => console.log('signup')}
        noValidate>
        <div className={styles.titleContainer}>
          <div className={styles.titleIconContainer}>
            <img
              className={styles.titleIcon}
              src="/img/signup-icon.png"
              alt=""
            />
          </div>
          <h2 className={styles.title}>Создать аккаунт</h2>
          <span className={styles.titleSubtitle}>
            Присоединяйтесь к пушистому сообществу
          </span>
        </div>
        <FormField label="Имя" htmlFor="signup-name">
          <Input
            id="signup-name"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Барсик"
            autoComplete="off"
          />
        </FormField>
        <FormField label="Фамилия" htmlFor="signup-lastname">
          <Input
            id="signup-lastname"
            name="lastname"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            placeholder="Матроскин"
            autoComplete="off"
          />
        </FormField>
        <FormField label="Логин" htmlFor="signup-login">
          <Input
            id="signup-login"
            name="login"
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="turbo_barsik"
            autoComplete="off"
          />
        </FormField>
        <FormField label="Телефон" htmlFor="signup-phone">
          <Input
            id="signup-phone"
            name="phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+79998887766"
            autoComplete="off"
          />
        </FormField>
        <FormField label="Email" htmlFor="signup-email">
          <Input
            id="signup-email"
            name="email"
            value={email}
            type="email"
            onChange={e => setEmail(e.target.value)}
            placeholder="cat@meow.com"
            autoComplete="off"
          />
        </FormField>
        <FormField label="Пароль" htmlFor="signup-password">
          <Input
            id="signup-password"
            name="password"
            value={password}
            type="password"
            onChange={e => setPassword(e.target.value)}
            placeholder="********"
            autoComplete="off"
          />
        </FormField>
        <div className={styles.formFooter}>
          <Button className={styles.formFooterButton} type="submit">
            Зарегистрироваться
          </Button>
          <span className={styles.formFooterDescription}>
            Уже есть аккаунт? <Link to="/signin">Войти</Link>
          </span>
        </div>
      </form>
      <div className={styles.footer}>
        <Link className={styles.footerLink} to="/">
          <span className={styles.footerLinkIcon}>←</span>
          На главную
        </Link>
      </div>
    </main>
  )
}
