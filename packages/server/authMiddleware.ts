import type { NextFunction, Request, Response } from 'express'

import { fetchAuthUser, type AuthUser } from './auth'

type AuthedRequest = Request & {
  user?: AuthUser
}

export const requireAuth = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await fetchAuthUser(req.headers.cookie)

  if (!user) {
    res.status(401).json({ reason: 'Unauthorized' })
    return
  }

  req.user = user
  next()
}
