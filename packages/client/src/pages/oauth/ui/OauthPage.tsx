import { Helmet } from 'react-helmet'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import { useAuth } from '@/app/providers'
import { oauthYandex } from '@/shared/api'
import { ensureAuthCookie, toAuthError } from '@/shared/auth'
import { getYandexOAuthRedirectUri } from '@/shared/config/oauth'

import { initOauthPage } from '../model/initOauthPage'

import styles from './OauthPage.module.scss'

export const OauthPage = () => {
  usePage({ initPage: initOauthPage })
  const navigate = useNavigate()
  const { refreshAuth } = useAuth()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const [error, setError] = useState<string | null>(null)
  const processedCode = useRef<string | null>(null)

  useEffect(() => {
    if (!code || processedCode.current === code) return

    processedCode.current = code
    setError(null)

    const redirectUri = getYandexOAuthRedirectUri()

    oauthYandex({ code, redirect_uri: redirectUri })
      .then(() => {
        ensureAuthCookie()
        refreshAuth()
        window.history.replaceState({}, '', '/oauth/')
        navigate('/', { replace: true })
      })
      .catch(err => {
        window.history.replaceState({}, '', '/oauth/')
        setError(toAuthError(err))
      })
  }, [code, navigate, refreshAuth])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Авторизация — Catsweeper</title>
      </Helmet>
      <section className={styles.page}>
        {!error ? (
          <p className={styles.message}>Завершаем вход через Яндекс…</p>
        ) : (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </section>
    </>
  )
}
