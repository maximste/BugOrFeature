import type { Request as ExpressRequest } from 'express'
import axios from 'axios'

import type { PageInitContext } from '@/app/routes'
import type { UserProfileResponse } from '@/shared/api/types'

export const createContext = (req: ExpressRequest): PageInitContext => ({})

export const createUrl = (req: ExpressRequest) => {
  const origin = `${req.protocol}://${req.get('host')}`

  return new URL(req.originalUrl || req.url, origin)
}

export const createFetchRequest = (req: ExpressRequest) => {
  const url = createUrl(req)

  const controller = new AbortController()
  req.on('close', () => controller.abort())

  const headers = new Headers()

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value)
        }
      } else {
        headers.set(key, values)
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal,
  }

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body != null) {
    init.body = req.body as BodyInit
  }

  return new Request(url.href, init)
}

const getServerUrl = () =>
  process.env.INTERNAL_SERVER_URL ??
  process.env.EXTERNAL_SERVER_URL ??
  'http://localhost:3001'

export const fetchAuthUserForSsr = async (
  req: ExpressRequest
): Promise<UserProfileResponse | null> => {
  const cookie = req.headers.cookie

  if (!cookie) {
    return null
  }

  try {
    const { data, status } = await axios.get<UserProfileResponse>(
      `${getServerUrl()}/auth/user`,
      {
        headers: { Cookie: cookie },
        validateStatus: () => true,
      }
    )

    if (status !== 200) {
      return null
    }

    return data
  } catch {
    return null
  }
}
