import type { UserProfile } from '@/entities/user'

import styles from './ProfileView.module.scss'

export type ProfileViewProps = {
  profile: UserProfile
}

function initials(displayName: string) {
  const parts = displayName.trim().split(/\s+/)
  const a = parts[0]?.[0] ?? '?'
  const b = parts[1]?.[0]
  return `${a}${b ?? ''}`.toUpperCase()
}

export const ProfileView = ({ profile }: ProfileViewProps) => {
  return (
    <div className={styles.root}>
      <article className={styles.card} aria-labelledby="profile-name">
        <div className={styles.hero}>
          {profile.avatarUrl ? (
            <img
              className={styles.avatarImg}
              src={profile.avatarUrl}
              alt="Иконка пользователя"
              width={96}
              height={96}
            />
          ) : (
            <div className={styles.avatarFallback} aria-hidden>
              {initials(profile.displayName)}
            </div>
          )}
          <div className={styles.identity}>
            <h2 id="profile-name" className={styles.name}>
              {profile.displayName}
            </h2>
            <p className={styles.meta}>
              @{profile.handle}
              <span className={styles.metaDot}> · </span>
              <span>{profile.joinedLabel}</span>
            </p>
          </div>
        </div>
        <p className={styles.bio}>{profile.bio}</p>
        <ul className={styles.stats} aria-label="Statistics">
          <li className={styles.stat}>
            <span className={styles.statValue}>
              {profile.stats.forumTopicsCount}
            </span>
            <span className={styles.statLabel}>тем на форуме</span>
          </li>
          <li className={styles.stat}>
            <span className={styles.statValue}>
              {profile.stats.forumCommentsCount}
            </span>
            <span className={styles.statLabel}>комментариев</span>
          </li>
          <li className={styles.stat}>
            <span className={styles.statValue}>
              {profile.stats.bestGameScore != null
                ? profile.stats.bestGameScore
                : '—'}
            </span>
            <span className={styles.statLabel}>лучший счёт</span>
          </li>
        </ul>
      </article>

      <section className={styles.secondary} aria-labelledby="activity-heading">
        <h3 id="activity-heading" className={styles.secondaryTitle}>
          Недавняя активность
        </h3>
        <p className={styles.placeholder}>
          Здесь позже появится лента: темы, ответы и результаты игры.
        </p>
      </section>
    </div>
  )
}
