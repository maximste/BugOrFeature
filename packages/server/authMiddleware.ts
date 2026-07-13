import type { NextFunction, Request, Response } from 'express'

import { checkAuth, type AuthUser } from './auth'

type AuthedRequest = Request & {
  user?: AuthUser
}

export const requireAuth = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
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

  res.status(401).json({ reason: 'Unauthorized' })
}
