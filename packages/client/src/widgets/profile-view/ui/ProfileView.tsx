import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import type { UserProfile } from '@/entities/user'
import {
  changePassword,
  loadAvatarPreviewUrl,
  toProfileError,
  updateProfile,
  uploadAvatar,
} from '@/shared/profile'
import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'

import styles from './ProfileView.module.scss'

export type ProfileViewProps = {
  profile: UserProfile
  onProfileChange: (profile: UserProfile) => void
}

const AVATAR_ACCEPT = 'image/jpeg,image/jpg,image/png,image/gif,image/webp'

function safeTrim(value: string | null | undefined) {
  return (value ?? '').trim()
}

function initials(
  firstName: string | null | undefined,
  secondName: string | null | undefined
) {
  const a = safeTrim(firstName)[0] ?? '?'
  const b = safeTrim(secondName)[0] ?? ''
  return `${a}${b}`.toUpperCase()
}

function formatIdentity(
  firstName: string | null | undefined,
  secondName: string | null | undefined,
  displayName: string | null | undefined,
  login: string | null | undefined
) {
  const fullName = [safeTrim(firstName), safeTrim(secondName)]
    .filter(Boolean)
    .join(' ')
  const nickname = safeTrim(displayName)
  const loginValue = safeTrim(login)
  const primary = nickname || fullName || loginValue

  const showFullName =
    fullName.length > 0 &&
    fullName !== primary &&
    (nickname.length > 0 || fullName !== loginValue)

  return {
    primary: primary || 'Пользователь',
    fullName: showFullName ? fullName : null,
    login: loginValue,
  }
}

export const ProfileView = ({ profile, onProfileChange }: ProfileViewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState(profile.first_name ?? '')
  const [secondName, setSecondName] = useState(profile.second_name ?? '')
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [login, setLogin] = useState(profile.login ?? '')
  const [email, setEmail] = useState(profile.email ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarBroken, setAvatarBroken] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)

  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    setFirstName(profile.first_name ?? '')
    setSecondName(profile.second_name ?? '')
    setDisplayName(profile.display_name ?? '')
    setLogin(profile.login ?? '')
    setEmail(profile.email ?? '')
    setPhone(profile.phone ?? '')
  }, [profile])

  useEffect(() => {
    if (avatarFile) {
      return
    }

    let cancelled = false
    let objectUrl: string | null = null

    const load = async () => {
      if (!profile.avatar) {
        setAvatarPreview(null)
        setAvatarBroken(false)
        return
      }

      const url = await loadAvatarPreviewUrl(profile.avatar)

      if (cancelled) {
        if (url) {
          URL.revokeObjectURL(url)
        }
        return
      }

      objectUrl = url
      setAvatarPreview(url)
      setAvatarBroken(url == null)
    }

    void load()

    return () => {
      cancelled = true
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [profile.avatar, avatarFile])

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

    setAvatarError(null)
    setAvatarSuccess(null)

    if (avatarPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const applyProfile = (next: UserProfile) => {
    onProfileChange(next)

    if (avatarPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)
    setProfileLoading(true)

    try {
      const updated = await updateProfile({
        firstName,
        secondName,
        displayName,
        login,
        email,
        phone,
      })
      applyProfile(updated)
      setProfileSuccess('Профиль сохранён')
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : toProfileError(err))
    } finally {
      setProfileLoading(false)
    }
  }

  const handleAvatarSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!avatarFile) {
      return
    }

    setAvatarError(null)
    setAvatarSuccess(null)
    setAvatarLoading(true)

    try {
      const updated = await uploadAvatar(avatarFile)
      onProfileChange(updated)
      setAvatarFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setAvatarSuccess('Аватар обновлён')
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : toProfileError(err))
    } finally {
      setAvatarLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)
    setPasswordLoading(true)

    try {
      await changePassword({ oldPassword, newPassword })
      setOldPassword('')
      setNewPassword('')
      setPasswordSuccess('Пароль изменён')
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : toProfileError(err))
    } finally {
      setPasswordLoading(false)
    }
  }

  const formBusy = profileLoading || avatarLoading || passwordLoading
  const identity = formatIdentity(firstName, secondName, displayName, login)

  return (
    <div className={styles.root}>
      <section className={styles.section} aria-labelledby="avatar-heading">
        <h2 id="avatar-heading" className={styles.sectionTitle}>
          Аватар
        </h2>
        <form className={styles.form} onSubmit={handleAvatarSubmit} noValidate>
          {avatarError != null ? (
            <p className={styles.error} role="alert">
              {avatarError}
            </p>
          ) : null}
          {avatarSuccess != null ? (
            <p className={styles.success} role="status">
              {avatarSuccess}
            </p>
          ) : null}
          <div className={styles.avatarSection}>
            {avatarPreview && !avatarBroken ? (
              <img
                className={styles.avatarImg}
                src={avatarPreview}
                alt="Аватар пользователя"
                width={96}
                height={96}
                onError={() => setAvatarBroken(true)}
              />
            ) : (
              <div className={styles.avatarFallback} aria-hidden>
                {initials(firstName, secondName)}
              </div>
            )}

            <div className={styles.identity}>
              <p className={styles.identityName}>{identity.primary}</p>
              {identity.fullName != null ? (
                <p className={styles.identityFullName}>{identity.fullName}</p>
              ) : null}
              {identity.login.length > 0 ? (
                <p className={styles.identityLogin}>@{identity.login}</p>
              ) : null}
            </div>

            <div className={styles.avatarActions}>
              <input
                ref={fileInputRef}
                id="profile-avatar"
                name="avatar"
                type="file"
                className={styles.fileInputHidden}
                accept={AVATAR_ACCEPT}
                onChange={handleAvatarChange}
                disabled={formBusy}
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
                  disabled={!avatarFile || avatarLoading}>
                  {avatarLoading ? 'Загрузка…' : 'Загрузить аватар'}
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
          {profileError != null ? (
            <p className={styles.error} role="alert">
              {profileError}
            </p>
          ) : null}
          {profileSuccess != null ? (
            <p className={styles.success} role="status">
              {profileSuccess}
            </p>
          ) : null}
          <FormField label="Имя" htmlFor="profile-first-name">
            <Input
              id="profile-first-name"
              name="first_name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              autoComplete="given-name"
              disabled={formBusy}
            />
          </FormField>
          <FormField label="Фамилия" htmlFor="profile-second-name">
            <Input
              id="profile-second-name"
              name="second_name"
              value={secondName}
              onChange={e => setSecondName(e.target.value)}
              autoComplete="family-name"
              disabled={formBusy}
            />
          </FormField>
          <FormField label="Отображаемое имя" htmlFor="profile-display-name">
            <Input
              id="profile-display-name"
              name="display_name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              autoComplete="nickname"
              disabled={formBusy}
            />
          </FormField>
          <FormField label="Логин" htmlFor="profile-login">
            <Input
              id="profile-login"
              name="login"
              value={login}
              onChange={e => setLogin(e.target.value)}
              autoComplete="username"
              disabled={formBusy}
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
              disabled={formBusy}
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
              disabled={formBusy}
            />
          </FormField>
          <Button type="submit" disabled={profileLoading}>
            {profileLoading ? 'Сохранение…' : 'Сохранить профиль'}
          </Button>
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
          {passwordError != null ? (
            <p className={styles.error} role="alert">
              {passwordError}
            </p>
          ) : null}
          {passwordSuccess != null ? (
            <p className={styles.success} role="status">
              {passwordSuccess}
            </p>
          ) : null}
          <FormField label="Текущий пароль" htmlFor="profile-old-password">
            <Input
              id="profile-old-password"
              name="oldPassword"
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              autoComplete="off"
              disabled={formBusy}
            />
          </FormField>
          <FormField label="Новый пароль" htmlFor="profile-new-password">
            <Input
              id="profile-new-password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              autoComplete="off"
              disabled={formBusy}
            />
          </FormField>
          <Button type="submit" disabled={passwordLoading}>
            {passwordLoading ? 'Смена…' : 'Сменить пароль'}
          </Button>
        </form>
      </section>
    </div>
  )
}
