import type { Request } from 'express'
export declare const GUEST_ONLY_PATHS: readonly ['/signin', '/signup', '/oauth']
export type PageAuthRequirement = 'guest' | 'private' | 'none'
export declare const normalizePathname: (pathname: string) => string
export declare const getPageAuthRequirement: (
  pathname: string
) => PageAuthRequirement
export declare const checkIsAuthenticated: (req: Request) => Promise<boolean>
export declare const resolvePageAuthRedirect: (
  req: Request
) => Promise<string | null>
