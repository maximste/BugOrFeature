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

const PRACTICUM_API_BASE =
  process.env.PRACTICUM_API_BASE ?? 'https://ya-praktikum.tech/api/v2'

export const fetchAuthUser = async (
  cookieHeader?: string
): Promise<AuthUser | null> => {
  if (!cookieHeader) {
    return null
  }

  try {
    const { data, status } = await axios.get<AuthUser>(
      `${PRACTICUM_API_BASE}/auth/user`,
      {
        headers: { Cookie: cookieHeader },
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

export const isAuthenticated = async (
  cookieHeader?: string
): Promise<boolean> => (await fetchAuthUser(cookieHeader)) != null
