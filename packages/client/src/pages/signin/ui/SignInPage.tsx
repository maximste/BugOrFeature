import { Helmet } from 'react-helmet'

import { usePage } from '@/app/hooks/usePage'
import { SignInForm } from '@/features/sign-in'
import { useRequireAuth } from '@/shared/hooks'
import { BackLink } from '@/shared/ui/back-link'

import { initSignInPage } from '../model/initSignInPage'

import styles from './SignInPage.module.scss'

export const SignInPage = () => {
  useRequireAuth('guest')
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
        <BackLink />
      </section>
    </>
  )
}
