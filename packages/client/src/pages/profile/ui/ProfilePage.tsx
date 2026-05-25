import { Helmet } from 'react-helmet'

import { usePage } from '@/app/hooks/usePage'
import { ProfileView } from '@/widgets/profile-view'
import { BackLink } from '@/shared/ui/back-link'
import { PageHeading } from '@/shared/ui/page-heading'

import { mockCurrentUserProfile } from '../model/mockProfileData'
import { initProfilePage } from '../model/initProfilePage'

import styles from './ProfilePage.module.scss'

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage })

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
        <ProfileView profile={mockCurrentUserProfile} />
      </section>
    </>
  )
}
