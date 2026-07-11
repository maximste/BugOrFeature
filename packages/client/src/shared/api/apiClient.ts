import axios, { isAxiosError } from 'axios'

import { API_FETCH_BASE_URL } from '@/shared/config/env'

import type {
  ChangePasswordBody,
  OauthServiceIdResponse,
  ReasonBody,
  SignInBody,
  SignUpBody,
  SignUpResponse,
  UpdateUserProfileBody,
  UserProfileResponse,
} from './types'
import { LeaderboardUnit } from '@/entities/leaderboard'

/**
 * Общий слой HTTP-запросов к API Практикума.
 * Ошибки приводим к ApiError с понятным текстом для форм.
 */

/** Ошибка от API: код ответа (status) и текст для пользователя (reason / message). */
export class ApiError extends Error {
  status: number
  reason?: string

  constructor(status: number, message: string, reason?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.reason = reason
  }
}

export const api = axios.create({
  baseURL: API_FETCH_BASE_URL ?? '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const getReason = (data?: ReasonBody) => data?.reason

const toApiError = (err: unknown): ApiError => {
  if (!isAxiosError<ReasonBody>(err)) {
    return new ApiError(0, 'Не удалось связаться с сервером')
  }

  const status = err.response?.status ?? 0
  const reason = getReason(err.response?.data)

  if (status === 401) {
    return new ApiError(401, reason ?? 'Требуется авторизация', reason)
  }

  if (status === 400) {
    return new ApiError(400, reason ?? 'Некорректные данные', reason)
  }

  if (status === 0) {
    return new ApiError(0, 'Не удалось связаться с сервером')
  }

  return new ApiError(
    status,
    reason ?? 'Что-то пошло не так. Попробуйте ещё раз.',
    reason
  )
}

export const request = async <T>(
  call: () => Promise<{ data: T }>
): Promise<T> => {
  try {
    const { data } = await call()
    return data
  } catch (err) {
    throw toApiError(err)
  }
}

export const postSignIn = (body: SignInBody) =>
  request(() => api.post<void>('/auth/signin', body))

/** GET /oauth/yandex/service-id — service_id (CLIENT_ID) для OAuth Яндекса */
export const getOauthYandexServiceId = (redirectUri: string) =>
  request(() =>
    api.get<OauthServiceIdResponse>('/oauth/yandex/service-id', {
      params: { redirect_uri: redirectUri },
    })
  )

export const oauthYandex = (body: { code: string; redirect_uri?: string }) =>
  request(() => api.post<SignUpResponse>('/oauth/yandex', body))

export const postSignUp = (body: SignUpBody) =>
  request(() => api.post<SignUpResponse>('/auth/signup', body))

export const postLogout = () => request(() => api.post<void>('/auth/logout'))

export const getAuthUser = () =>
  request(() => api.get<UserProfileResponse>('/auth/user'))

export const putUserProfile = (body: UpdateUserProfileBody) =>
  request(() => api.put<UserProfileResponse>('/user/profile', body))

export const putUserProfileAvatar = (file: File) => {
  const formData = new FormData()
  formData.append('avatar', file)

  return request(() =>
    api.put<UserProfileResponse>('/user/profile/avatar', formData, {
      headers: { Accept: 'application/json' },
      // Иначе уходит Content-Type: application/json из defaults → connection reset
      transformRequest: [
        (data, headers) => {
          if (data instanceof FormData && headers) {
            delete headers['Content-Type']
          }

          return data
        },
      ],
    })
  )
}

export const putUserPassword = (body: ChangePasswordBody) =>
  request(() => api.put<void>('/user/password', body))

/** Загрузка картинки (аватар) с cookie сессии — надёжнее, чем <img src> на другой origin */
export const fetchResourceBlob = async (path: string): Promise<Blob> => {
  try {
    const { data } = await api.get<Blob>(path, { responseType: 'blob' })
    return data
  } catch (err) {
    throw toApiError(err)
  }
}
