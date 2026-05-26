import type { UserProfile } from '@/entities/user'

export const mockCurrentUserProfile: UserProfile = {
  id: 123,
  first_name: 'Петя',
  second_name: 'Пупкин',
  display_name: 'Петя Пупкин',
  login: 'userLogin',
  email: 'string@ya.ru',
  phone: '+79001001100',
  avatar: null,
}
