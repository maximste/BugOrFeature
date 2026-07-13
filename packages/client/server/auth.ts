import type { Request } from 'express'
import axios from 'axios'

export const GUEST_ONLY_PATHS = ['/signin', '/signup', '/oauth'] as const

export type PageAuthRequirement = 'guest' | 'private' | 'none'

export type AuthCheckStatus =
  | 'authenticated'
  | 'unauthenticated'
  | 'unavailable'

export const normalizePathname = (pathname: string): string => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export const getPageAuthRequirement = (
  pathname: string
): PageAuthRequirement => {
  const path = normalizePathname(pathname)

  if ((GUEST_ONLY_PATHS as readonly string[]).includes(path)) {
    return 'guest'
  }

  if (path === '/500') {
    return 'none'
  }

  if (
    path === '/' ||
    path === '/game' ||
    path === '/leaderboard-page' ||
    path === '/profile' ||
    path.startsWith('/forum')
  ) {
    return 'private'
  }

  return 'none'
}

const getServerUrl = () =>
  process.env.INTERNAL_SERVER_URL ??
  process.env.EXTERNAL_SERVER_URL ??
  'http://localhost:3001'

const isServerError = (status: number) => status >= 500

type AuthStatusResponse =
  | { kind: 'authenticated' }
  | { kind: 'unauthenticated' }
  | { kind: 'unavailable' }

const checkAuthStatusOnce = async (
  cookie: string
): Promise<AuthStatusResponse> => {
  try {
    const { status } = await axios.get(`${getServerUrl()}/auth/user`, {
      headers: { Cookie: cookie },
      validateStatus: () => true,
    })

    if (status === 200) {
      return { kind: 'authenticated' }
    }

    if (isServerError(status)) {
      return { kind: 'unavailable' }
    }

    return { kind: 'unauthenticated' }
  } catch {
    return { kind: 'unavailable' }
  }
}

const resolveAuthStatusResponse = (
  response: AuthStatusResponse
): AuthCheckStatus | null => {
  if (response.kind === 'authenticated') {
    return 'authenticated'
  }

  if (response.kind === 'unauthenticated') {
    return 'unauthenticated'
  }

  return null
}

export const checkAuth = async (req: Request): Promise<AuthCheckStatus> => {
  const cookie = req.headers.cookie

  if (!cookie) {
    return 'unauthenticated'
  }

  const first = await checkAuthStatusOnce(cookie)
  const firstResult = resolveAuthStatusResponse(first)

  if (firstResult != null) {
    return firstResult
  }

  const second = await checkAuthStatusOnce(cookie)
  const secondResult = resolveAuthStatusResponse(second)

  if (secondResult != null) {
    return secondResult
  }

  return 'unavailable'
}

export const checkIsAuthenticated = async (req: Request): Promise<boolean> => {
  const status = await checkAuth(req)

  return status === 'authenticated'
}

export const resolvePageAuthRedirect = async (
  req: Request
): Promise<string | null> => {
  const pathname = new URL(req.originalUrl || req.url, 'http://localhost')
    .pathname
  const requirement = getPageAuthRequirement(pathname)

  if (requirement === 'none') {
    return null
  }

  const authStatus = await checkAuth(req)

  if (requirement === 'private') {
    if (authStatus === 'unauthenticated') {
      return '/signin'
    }

    if (authStatus === 'unavailable') {
      return '/500'
    }
  }

  if (requirement === 'guest' && authStatus === 'authenticated') {
    return '/'
  }

  return null
}
