import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'

import type { UserProfile } from '@/entities/user'
import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'

import styles from './ProfileView.module.scss'

export type ProfileViewProps = {
  profile: UserProfile
}

const AVATAR_ACCEPT = 'image/jpeg,image/jpg,image/png,image/gif,image/webp'

function initials(firstName: string, secondName: string) {
  const a = firstName.trim()[0] ?? '?'
  const b = secondName.trim()[0] ?? ''
  return `${a}${b}`.toUpperCase()
}

export const ProfileView = ({ profile }: ProfileViewProps) => {
  const [firstName, setFirstName] = useState(profile.first_name)
  const [secondName, setSecondName] = useState(profile.second_name)
  const [displayName, setDisplayName] = useState(profile.display_name)
  const [login, setLogin] = useState(profile.login)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar ?? null
  )
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    return () => {
      if (avatarFile && avatarPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarFile, avatarPreview])

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    if (avatarPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleProfileSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleAvatarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className={styles.root}>
      <section className={styles.section} aria-labelledby="avatar-heading">
        <h2 id="avatar-heading" className={styles.sectionTitle}>
          Аватар
        </h2>
        <form className={styles.form} onSubmit={handleAvatarSubmit} noValidate>
          <div className={styles.avatarSection}>
            {avatarPreview ? (
              <img
                className={styles.avatarImg}
                src={avatarPreview}
                alt="Аватар пользователя"
                width={96}
                height={96}
              />
            ) : (
              <div className={styles.avatarFallback} aria-hidden>
                {initials(firstName, secondName)}
              </div>
            )}

            <div className={styles.avatarActions}>
              <input
                id="profile-avatar"
                name="avatar"
                type="file"
                className={styles.fileInputHidden}
                accept={AVATAR_ACCEPT}
                onChange={handleAvatarChange}
              />
              <div className={styles.avatarButtons}>
                <label
                  htmlFor="profile-avatar"
                  className={styles.filePickButton}>
                  Выбрать изображение
                </label>
                <Button
                  type="submit"
                  className={styles.uploadButton}
                  disabled={!avatarFile}>
                  Загрузить аватар
                </Button>
              </div>
              <p className={styles.fileName}>
                {avatarFile?.name ?? 'Файл не выбран'}
              </p>
              <p className={styles.hint}>JPEG, JPG, PNG, GIF или WebP</p>
            </div>
          </div>
        </form>
      </section>

      <section className={styles.section} aria-labelledby="profile-heading">
        <h2 id="profile-heading" className={styles.sectionTitle}>
          Данные профиля
        </h2>
        <form className={styles.form} onSubmit={handleProfileSubmit} noValidate>
          <FormField label="Имя" htmlFor="profile-first-name">
            <Input
              id="profile-first-name"
              name="first_name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
          </FormField>
          <FormField label="Фамилия" htmlFor="profile-second-name">
            <Input
              id="profile-second-name"
              name="second_name"
              value={secondName}
              onChange={e => setSecondName(e.target.value)}
              autoComplete="family-name"
            />
          </FormField>
          <FormField label="Отображаемое имя" htmlFor="profile-display-name">
            <Input
              id="profile-display-name"
              name="display_name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              autoComplete="nickname"
            />
          </FormField>
          <FormField label="Логин" htmlFor="profile-login">
            <Input
              id="profile-login"
              name="login"
              value={login}
              onChange={e => setLogin(e.target.value)}
              autoComplete="username"
            />
          </FormField>
          <FormField label="Email" htmlFor="profile-email">
            <Input
              id="profile-email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </FormField>
          <FormField label="Телефон" htmlFor="profile-phone">
            <Input
              id="profile-phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </FormField>
          <Button type="submit">Сохранить профиль</Button>
        </form>
      </section>

      <section className={styles.section} aria-labelledby="password-heading">
        <h2 id="password-heading" className={styles.sectionTitle}>
          Смена пароля
        </h2>
        <form
          className={styles.form}
          onSubmit={handlePasswordSubmit}
          noValidate>
          <FormField label="Текущий пароль" htmlFor="profile-old-password">
            <Input
              id="profile-old-password"
              name="oldPassword"
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              autoComplete="current-password"
            />
          </FormField>
          <FormField label="Новый пароль" htmlFor="profile-new-password">
            <Input
              id="profile-new-password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </FormField>
          <Button type="submit">Сменить пароль</Button>
        </form>
      </section>
    </div>
  )
}
