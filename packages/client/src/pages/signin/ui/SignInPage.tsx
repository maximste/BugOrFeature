import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import { SignInForm } from '@/features/sign-in'

import { initSignInPage } from '../model/initSignInPage'

import styles from './SignInPage.module.scss'

export const SignInPage = () => {
  usePage({ initPage: initSignInPage })

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход — Catsweeper</title>
        <meta name="description" content="Войдите, чтобы общаться на форуме" />
      </Helmet>
      <section className={styles.page}>
        <SignInForm />
        <Link className={styles.back} to="/">
          ← На главную
        </Link>
      </section>
    </>
  )
}
