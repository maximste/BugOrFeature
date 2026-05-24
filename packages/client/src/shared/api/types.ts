/** Тело ошибки API Практикума (400 и др.) */
export type ReasonBody = {
  reason?: string
}

export type SignInBody = {
  login: string
  password: string
}

export type SignUpBody = {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export type SignUpResponse = {
  id: number
}
