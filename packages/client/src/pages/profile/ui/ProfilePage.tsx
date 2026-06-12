import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import { useAuth } from '@/app/providers'
import {
  fetchAuthUser,
  selectAuthStatus,
  selectAuthUser,
  selectIsAuthUserLoading,
  setUser,
  useDispatch,
  useSelector,
} from '@/app/store'
import { ProfileView } from '@/widgets/profile-view'
import { BackLink } from '@/shared/ui/back-link'
import { PageHeading } from '@/shared/ui/page-heading'

import { useIsOffline } from '../hooks/useIsOffline'
import { initProfilePage } from '../model/initProfilePage'
import {
  toProfileLoadError,
  type ProfileLoadError,
} from '../model/profileLoadError'

import styles from './ProfilePage.module.scss'

export const ProfilePage = () => {
  const { isAuthenticated } = useAuth()
  const dispatch = useDispatch()
  const user = useSelector(selectAuthUser)
  const authStatus = useSelector(selectAuthStatus)
  const isAuthUserLoading = useSelector(selectIsAuthUserLoading)

  usePage({ initPage: initProfilePage })

  const isOffline = useIsOffline()
  const [loadError, setLoadError] = useState<ProfileLoadError | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    if (user != null || isAuthUserLoading) {
      return
    }

    if (authStatus === 'failed') {
      setLoadError({
        message: 'Не удалось загрузить профиль. Попробуйте войти снова.',
        showSignInHint: true,
      })
      return
    }

    dispatch(fetchAuthUser())
      .unwrap()
      .catch(err => setLoadError(toProfileLoadError(err)))
  }, [isAuthenticated, user, isAuthUserLoading, authStatus, dispatch])

  const loading = isAuthenticated && user == null && isAuthUserLoading

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль — BugOrFeature</title>
        <meta name="description" content="Страница пользователя BugOrFeature" />
      </Helmet>
      <section className={styles.page}>
        <BackLink to="/">← На главную</BackLink>
        <PageHeading title="Профиль" className={styles.heading} />

        {loading ? <p className={styles.status}>Загрузка профиля…</p> : null}

        {!loading && loadError != null ? (
          <div className={styles.errorBlock} role="alert">
            <p className={styles.error}>{loadError.message}</p>
            {loadError.showSignInHint ? (
              <p className={styles.errorHint}>
                <Link to="/signin">Войдите</Link>, если вы ещё не авторизованы.
              </p>
            ) : null}
          </div>
        ) : null}

        {!loading && user != null ? (
          <>
            {isOffline ? (
              <p className={styles.status} role="status">
                Нет сети — сохранение изменений недоступно.
              </p>
            ) : null}
            <ProfileView
              profile={user}
              onProfileChange={profile => dispatch(setUser(profile))}
            />
          </>
        ) : null}
      </section>
    </>
  )
}
