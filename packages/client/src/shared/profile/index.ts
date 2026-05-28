/**
 * Сценарии профиля: загрузка пользователя, обновление данных, аватар, пароль.
 */

import type { UserProfileResponse } from '@/shared/api'
import {
  ApiError,
  fetchResourceBlob,
  getAuthUser,
  putUserPassword,
  putUserProfile,
  putUserProfileAvatar,
} from '@/shared/api'
import { API_FETCH_BASE_URL } from '@/shared/config/env'

const API_V2_PREFIX = '/api/v2'

const toResourcePath = (avatar: string): string => {
  if (/^https?:\/\//i.test(avatar)) {
    const { pathname, search } = new URL(avatar)
    return toResourcePath(`${pathname}${search}`)
  }

  const path = avatar.startsWith('/') ? avatar : `/${avatar}`

  if (path.startsWith(`${API_V2_PREFIX}/resources`)) {
    return path
  }

  if (path.startsWith('/resources/')) {
    return `${API_V2_PREFIX}${path}`
  }

  if (
    /^\/[\da-f-]{8}-[\da-f-]{4}-[\da-f-]{4}-[\da-f-]{4}-[\da-f-]{12}\//i.test(
      path
    )
  ) {
    return `${API_V2_PREFIX}/resources${path}`
  }

  return path
}

export const toProfileError = (err: unknown): string => {
  if (err instanceof ApiError) {
    return err.reason ?? err.message
  }

  return 'Что-то пошло не так. Попробуйте ещё раз.'
}

const throwProfileError = (err: ApiError): never => {
  throw new Error(err.reason ?? err.message)
}

const withProfileError = async <T>(call: () => Promise<T>): Promise<T> => {
  try {
    return await call()
  } catch (err) {
    if (err instanceof ApiError) {
      throwProfileError(err)
    }

    throw err
  }
}

/** Путь для axios: dev — с ведущим / (Vite proxy), prod — относительно baseURL /api/v2 */
export const getAvatarRequestPath = (avatar: string): string => {
  const resourcePath = toResourcePath(avatar)

  if (!API_FETCH_BASE_URL) {
    return resourcePath
  }

  return resourcePath.startsWith(`${API_V2_PREFIX}/`)
    ? resourcePath.slice(API_V2_PREFIX.length + 1)
    : resourcePath.replace(/^\//, '')
}

/** Превью аватара: GET с cookie, blob URL для <img> */
export const loadAvatarPreviewUrl = async (
  avatar?: string | null
): Promise<string | null> => {
  if (!avatar) {
    return null
  }

  try {
    const blob = await fetchResourceBlob(getAvatarRequestPath(avatar))

    if (blob.type === 'text/html' || blob.size === 0) {
      return null
    }

    if (blob.type && !blob.type.startsWith('image/')) {
      return null
    }

    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

export const fetchCurrentUser = () => withProfileError(() => getAuthUser())

export type UpdateProfileFields = {
  firstName: string
  secondName: string
  displayName: string
  login: string
  email: string
  phone: string
}

export const updateProfile = (fields: UpdateProfileFields) =>
  withProfileError(() =>
    putUserProfile({
      first_name: fields.firstName.trim(),
      second_name: fields.secondName.trim(),
      display_name: fields.displayName.trim(),
      login: fields.login.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
    })
  )

export const uploadAvatar = (file: File) =>
  withProfileError(() => putUserProfileAvatar(file))

export type ChangePasswordFields = {
  oldPassword: string
  newPassword: string
}

export const changePassword = (fields: ChangePasswordFields) =>
  withProfileError(() =>
    putUserPassword({
      oldPassword: fields.oldPassword,
      newPassword: fields.newPassword,
    })
  )
