import { NextFunction, Request, Response } from 'express'

import { checkAuth, type AuthUser } from '../auth'
import { sanitizeText } from '../utils/sanitize'

export type ForumAuthUser = {
  id: number
  login: string
  displayName: string
}

const toForumUser = (user: AuthUser): ForumAuthUser => {
  const rawDisplayName =
    user.display_name?.trim() ||
    [user.first_name, user.second_name].filter(Boolean).join(' ').trim() ||
    user.login

  let displayName = sanitizeText(rawDisplayName, 255)

  if (!displayName) {
    displayName = ''
  }

  return {
    id: user.id,
    login: user.login,
    displayName,
  }
}

export const getAuthUser = (req: Request): ForumAuthUser =>
  toForumUser(req.user as AuthUser)

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const result = await checkAuth(req.headers.cookie)

  if (result.status === 'authenticated') {
    req.user = result.user
    next()
    return
  }

  if (result.status === 'unavailable') {
    res.status(503).json({ reason: 'Auth service unavailable' })
    return
  }

  res.status(403).json({ reason: 'Unauthorized' })
}
