import { Helmet } from 'react-helmet-async'

import { usePage } from '@/app/hooks/usePage'

import { initSignUpPage } from '../model/initSignUpPage'

export const SignUpPage = () => {
  usePage({ initPage: initSignUpPage })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация — Catsweeper</title>
        <meta name="description" content="Регистрация" />
      </Helmet>
      <h1>Регистрация</h1>
      <p>Регистрация (заглушка)</p>
    </div>
  )
}
