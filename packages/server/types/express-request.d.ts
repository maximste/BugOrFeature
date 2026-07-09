declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number
      first_name: string
      second_name: string
      display_name?: string | null
      login: string
      email: string
      phone: string
      avatar?: string | null
    }
  }
}

export {}
