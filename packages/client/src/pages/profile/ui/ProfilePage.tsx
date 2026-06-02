import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import type { UserProfile } from '@/entities/user'
import { AUTH_TARGET, useRequireAuth } from '@/shared/hooks'
import { fetchCurrentUser, toProfileError } from '@/shared/profile'
import { ProfileView } from '@/widgets/profile-view'
import { BackLink } from '@/shared/ui/back-link'
import { PageHeading } from '@/shared/ui/page-heading'

import { initProfilePage } from '../model/initProfilePage'

import styles from './ProfilePage.module.scss'

export const ProfilePage = () => {
  const { isAuthenticated } = useRequireAuth(AUTH_TARGET.PRIVATE)
  usePage({ initPage: initProfilePage })

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return

    let cancelled = false

    const loadProfile = async () => {
      setLoadError(null)
      setLoading(true)

      try {
        const user = await fetchCurrentUser()

        if (!cancelled) {
          setProfile(user)
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : toProfileError(err))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

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
            <p className={styles.error}>{loadError}</p>
            <p className={styles.errorHint}>
              <Link to="/signin">Войдите</Link>, если вы ещё не авторизованы.
            </p>
          </div>
        ) : null}

        {!loading && profile != null ? (
          <ProfileView profile={profile} onProfileChange={setProfile} />
        ) : null}
      </section>
    </>
  )
}
