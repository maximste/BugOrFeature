import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Heading, Text, chakra } from '@chakra-ui/react'

import type { UserProfile } from '@/entities/user'
import {
  changePassword,
  loadAvatarPreviewUrl,
  toProfileError,
  updateProfile,
  uploadAvatar,
} from '@/shared/profile'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { FormField } from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/input'
import {
  handleValidationBlur,
  handleValidationFocus,
  validateForm,
} from '@/shared/lib/validations'

export type ProfileViewProps = {
  profile: UserProfile
  onProfileChange: (profile: UserProfile) => void
}

const AVATAR_ACCEPT = 'image/jpeg,image/jpg,image/png,image/gif,image/webp'
const Form = chakra('form')
const FilePickLabel = chakra('label')
const HiddenFileInput = chakra('input')

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

    const { isValid, data } = validateForm(e.currentTarget)
    if (!isValid) {
      setProfileLoading(false)
      return
    }

    try {
      const updated = await updateProfile({
        firstName: data.first_name,
        secondName: data.second_name,
        displayName: data.display_name,
        login: data.login,
        email: data.email,
        phone: data.phone,
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

    const { isValid, data } = validateForm(e.currentTarget)
    if (!isValid) {
      setPasswordLoading(false)
      return
    }

    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
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

  const errorTextProps = {
    m: 0,
    fontFamily: 'body',
    fontSize: '14px',
    fontWeight: '500',
    color: 'danger',
  } as const

  const successTextProps = {
    m: 0,
    fontFamily: 'body',
    fontSize: '14px',
    fontWeight: '500',
    color: 'text',
  } as const

  return (
    <Flex direction="column" gap={6}>
      <Card
        as="section"
        p="24px"
        border="1px solid"
        borderColor="border"
        aria-labelledby="avatar-heading">
        <Heading
          as="h2"
          id="avatar-heading"
          fontFamily="body"
          fontSize="18px"
          fontWeight="800"
          margin="0 0 16px"
          color="text">
          Аватар
        </Heading>
        <Form
          display="flex"
          flexDirection="column"
          gap={4}
          onSubmit={handleAvatarSubmit}
          noValidate>
          {avatarError != null ? (
            <Text {...errorTextProps} role="alert">
              {avatarError}
            </Text>
          ) : null}
          {avatarSuccess != null ? (
            <Text {...successTextProps} role="status">
              {avatarSuccess}
            </Text>
          ) : null}
          <Flex flexWrap="wrap" alignItems="flex-start" gap="20px 24px">
            {avatarPreview && !avatarBroken ? (
              <img
                src={avatarPreview}
                alt="Аватар пользователя"
                width={96}
                height={96}
                style={{
                  flexShrink: 0,
                  width: 96,
                  height: 96,
                  borderRadius: 24,
                  objectFit: 'cover',
                }}
                onError={() => setAvatarBroken(true)}
              />
            ) : (
              <Flex
                flexShrink={0}
                w="96px"
                h="96px"
                borderRadius="24px"
                display="grid"
                css={{ placeItems: 'center' }}
                background="linear-gradient(145deg, #ffd7d1 0%, #FB9890 100%)"
                color="buttonText"
                boxShadow="avatar"
                textStyle="uiHeavy"
                aria-hidden>
                {initials(firstName, secondName)}
              </Flex>
            )}

            <Box
              flex="1 1 160px"
              minW={0}
              display="flex"
              flexDirection="column"
              gap={1}
              pt="4px">
              <Text
                m={0}
                fontFamily="body"
                fontSize="22px"
                fontWeight="800"
                color="text"
                lineHeight="1.25">
                {identity.primary}
              </Text>
              {identity.fullName != null ? (
                <Text
                  m={0}
                  fontFamily="body"
                  fontSize="15px"
                  fontWeight="500"
                  color="text">
                  {identity.fullName}
                </Text>
              ) : null}
              {identity.login.length > 0 ? (
                <Text
                  m={0}
                  fontFamily="body"
                  fontSize="14px"
                  fontWeight="500"
                  color="subtitleText">
                  @{identity.login}
                </Text>
              ) : null}
            </Box>

            <Flex flex="1 1 100%" direction="column" gap={2} minW={0}>
              <HiddenFileInput
                ref={fileInputRef}
                id="profile-avatar"
                name="avatar"
                type="file"
                srOnly
                accept={AVATAR_ACCEPT}
                onChange={handleAvatarChange}
                disabled={formBusy}
              />
              <Flex flexWrap="wrap" gap="10px">
                <FilePickLabel
                  htmlFor="profile-avatar"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  minH="36px"
                  padding="8px 16px"
                  cursor="pointer"
                  userSelect="none"
                  fontFamily="body"
                  fontSize="14px"
                  fontWeight="500"
                  borderRadius="pill"
                  background="card/80"
                  border="1px solid"
                  borderColor="border"
                  color="buttonText"
                  _hover={{ color: 'buttonBg' }}>
                  Выбрать изображение
                </FilePickLabel>
                <Button
                  type="submit"
                  minH="36px"
                  disabled={!avatarFile || avatarLoading}>
                  {avatarLoading ? 'Загрузка…' : 'Загрузить аватар'}
                </Button>
              </Flex>
              <Text
                m={0}
                fontFamily="body"
                fontSize="13px"
                fontWeight="500"
                color="text"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap">
                {avatarFile?.name ?? 'Файл не выбран'}
              </Text>
              <Text
                m={0}
                fontFamily="body"
                fontSize="12px"
                fontWeight="400"
                color="subtitleText">
                JPEG, JPG, PNG, GIF или WebP
              </Text>
            </Flex>
          </Flex>
        </Form>
      </Card>

      <Card
        as="section"
        p="24px"
        border="1px solid"
        borderColor="border"
        aria-labelledby="profile-heading">
        <Heading
          as="h2"
          id="profile-heading"
          fontFamily="body"
          fontSize="18px"
          fontWeight="800"
          margin="0 0 16px"
          color="text">
          Данные профиля
        </Heading>
        <Form
          display="flex"
          flexDirection="column"
          gap={4}
          onSubmit={handleProfileSubmit}
          onFocus={e => handleValidationFocus(e.nativeEvent)}
          onBlur={e => handleValidationBlur(e.nativeEvent)}
          noValidate>
          {profileError != null ? (
            <Text {...errorTextProps} role="alert">
              {profileError}
            </Text>
          ) : null}
          {profileSuccess != null ? (
            <Text {...successTextProps} role="status">
              {profileSuccess}
            </Text>
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
        </Form>
      </Card>

      <Card
        as="section"
        p="24px"
        border="1px solid"
        borderColor="border"
        aria-labelledby="password-heading">
        <Heading
          as="h2"
          id="password-heading"
          fontFamily="body"
          fontSize="18px"
          fontWeight="800"
          margin="0 0 16px"
          color="text">
          Смена пароля
        </Heading>
        <Form
          display="flex"
          flexDirection="column"
          gap={4}
          onSubmit={handlePasswordSubmit}
          onFocus={e => handleValidationFocus(e.nativeEvent)}
          onBlur={e => handleValidationBlur(e.nativeEvent)}
          noValidate>
          {passwordError != null ? (
            <Text {...errorTextProps} role="alert">
              {passwordError}
            </Text>
          ) : null}
          {passwordSuccess != null ? (
            <Text {...successTextProps} role="status">
              {passwordSuccess}
            </Text>
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
        </Form>
      </Card>
    </Flex>
  )
}
