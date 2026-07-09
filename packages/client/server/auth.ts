import type { Request } from 'express'
import axios from 'axios'

export const GUEST_ONLY_PATHS = ['/signin', '/signup', '/oauth'] as const

export type PageAuthRequirement = 'guest' | 'private' | 'none'

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

export const checkIsAuthenticated = async (req: Request): Promise<boolean> => {
  const cookie = req.headers.cookie

  if (!cookie) {
    return false
  }

  try {
    const { status } = await axios.get(`${getServerUrl()}/auth/user`, {
      headers: { Cookie: cookie },
      validateStatus: () => true,
    })

    return status === 200
  } catch {
    return false
  }
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

  const authenticated = await checkIsAuthenticated(req)

  if (requirement === 'private' && !authenticated) {
    return '/signin'
  }

  if (requirement === 'guest' && authenticated) {
    return '/'
  }

  return null
}
