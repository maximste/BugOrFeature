import axios from 'axios'

export type AuthUser = {
  id: number
  first_name: string
  second_name: string
  display_name?: string | null
  login: string
  email: string
  phone: string
  avatar?: string | null
}

export type AuthCheckResult =
  | { status: 'authenticated'; user: AuthUser }
  | { status: 'unauthenticated' }
  | { status: 'unavailable' }

const PRACTICUM_API_BASE =
  process.env.PRACTICUM_API_BASE_URL ??
  process.env.PRACTICUM_API_BASE ??
  'https://ya-praktikum.tech/api/v2'

const isServerError = (status: number) => status >= 500

type AuthUserResponse =
  | { kind: 'success'; user: AuthUser }
  | { kind: 'unauthenticated' }
  | { kind: 'unavailable' }

const fetchAuthUserOnce = async (
  cookieHeader: string
): Promise<AuthUserResponse> => {
  try {
    const { data, status } = await axios.get<AuthUser>(
      `${PRACTICUM_API_BASE}/auth/user`,
      {
        headers: { Cookie: cookieHeader },
        validateStatus: () => true,
      }
    )

    if (status === 200) {
      return { kind: 'success', user: data }
    }

    if (isServerError(status)) {
      return { kind: 'unavailable' }
    }

    return { kind: 'unauthenticated' }
  } catch {
    return { kind: 'unavailable' }
  }
}

const resolveAuthResponse = (
  response: AuthUserResponse
): AuthCheckResult | null => {
  if (response.kind === 'success') {
    return { status: 'authenticated', user: response.user }
  }

  if (response.kind === 'unauthenticated') {
    return { status: 'unauthenticated' }
  }

  return null
}

export const checkAuth = async (
  cookieHeader?: string
): Promise<AuthCheckResult> => {
  if (!cookieHeader) {
    return { status: 'unauthenticated' }
  }

  const first = await fetchAuthUserOnce(cookieHeader)
  const firstResult = resolveAuthResponse(first)

  if (firstResult != null) {
    return firstResult
  }

  const second = await fetchAuthUserOnce(cookieHeader)
  const secondResult = resolveAuthResponse(second)

  if (secondResult != null) {
    return secondResult
  }

  return { status: 'unavailable' }
}

export const fetchAuthUser = async (
  cookieHeader?: string
): Promise<AuthUser | null> => {
  const result = await checkAuth(cookieHeader)

  return result.status === 'authenticated' ? result.user : null
}

export const isAuthenticated = async (
  cookieHeader?: string
): Promise<boolean> => {
  const result = await checkAuth(cookieHeader)

  return result.status === 'authenticated'
}
