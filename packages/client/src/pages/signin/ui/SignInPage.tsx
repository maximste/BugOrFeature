import { Helmet } from 'react-helmet'

import { usePage } from '@/app/hooks/usePage'

import { initSignInPage } from '../model/initSignInPage'

export const SignInPage = () => {
  usePage({ initPage: initSignInPage })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход</title>
        <meta name="description" content="Авторизация" />
      </Helmet>
      <h1>Вход</h1>
      <p>Авторизация (заглушка)</p>
    </div>
  )
}
