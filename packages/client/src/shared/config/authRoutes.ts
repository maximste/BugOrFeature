export const GUEST_ONLY_PATHS = ['/signin', '/signup', '/oauth'] as const

export const normalizePathname = (pathname: string): string => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export type PageAuthRequirement = 'guest' | 'private' | 'none'

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
