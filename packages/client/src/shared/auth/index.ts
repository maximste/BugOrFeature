/**
 * Сценарии авторизации: вход, регистрация, выход.
 * Формы вызывают signIn / signUp / logout; проверку полей будет реализована отдельно.
 * Cookie `token` нужна AuthProvider и AuthGate (см. refreshAuth после успешного входа).
 */

import { ApiError, postLogout, postSignIn, postSignUp } from '@/shared/api'
import { getCookie, removeCookie, setCookie } from '@/shared/lib/cookie'

/** Имя cookie, по которой UI понимает «пользователь вошёл» */
export const TOKEN_COOKIE = 'token'

/** Cookie сессии API Практикума */
export const AUTH_COOKIE = 'authCookie'
export const UUID_COOKIE = 'uuid'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7

/** Запасная cookie, если API выставил HttpOnly и JS не видит token (dev / localhost) */
export const ensureAuthCookie = () => {
  if (!getCookie(TOKEN_COOKIE)) {
    setCookie(TOKEN_COOKIE, 'client-session', { maxAge: SESSION_MAX_AGE })
  }
}

export const clearAuthCookie = () => {
  removeCookie(TOKEN_COOKIE)
  removeCookie(AUTH_COOKIE)
  removeCookie(UUID_COOKIE)
}

/** Для AuthProvider.refreshAuth() */
export const isAuthCookieSet = () => Boolean(getCookie(TOKEN_COOKIE))

/** Текст ошибки для форм */
export const toAuthError = (err: unknown): string => {
  if (err instanceof ApiError) {
    return err.reason ?? err.message
  }

  return 'Что-то пошло не так. Попробуйте ещё раз.'
}

const throwAuthError = (err: ApiError): never => {
  throw new Error(err.reason ?? err.message)
}

/** POST /auth/signin + cookie для UI. 400 «already in system» не считаем ошибкой */
export const signIn = async (
  login: string,
  password: string
): Promise<void> => {
  try {
    await postSignIn({
      login: login.trim(),
      password: password.trim(),
    })
  } catch (err) {
    if (err instanceof ApiError) {
      const alreadyLoggedIn =
        err.status === 400 &&
        err.reason?.toLowerCase().includes('already in system')

      if (!alreadyLoggedIn) {
        throwAuthError(err)
      }
    } else {
      throw err
    }
  }

  ensureAuthCookie()
}

export type SignUpFields = {
  firstName: string
  secondName: string
  login: string
  email: string
  password: string
  phone: string
}

/** POST /auth/signup — только создание аккаунта */
export const signUp = async (fields: SignUpFields): Promise<void> => {
  try {
    await postSignUp({
      first_name: fields.firstName.trim(),
      second_name: fields.secondName.trim(),
      login: fields.login.trim(),
      email: fields.email.trim(),
      password: fields.password.trim(),
      phone: fields.phone.trim(),
    })
  } catch (err) {
    if (err instanceof ApiError) {
      throwAuthError(err)
    }

    throw err
  }
}

/** POST /auth/logout; cookie на клиенте сбрасываем всегда */
export const logout = async (): Promise<void> => {
  try {
    await postLogout()
  } catch {
    // API недоступен — локально всё равно разлогиниваем UI
  } finally {
    clearAuthCookie()
  }
}
