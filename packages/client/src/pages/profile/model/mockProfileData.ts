import type { UserProfile } from '@/entities/user'

export const mockCurrentUserProfile: UserProfile = {
  id: 'demo-user',
  displayName: 'Мурзик',
  handle: 'murzik',
  joinedLabel: 'на сайте с мая 2026',
  bio: 'На форуме делюсь опытом, в игре — за рекорды.',
  avatarUrl: null,
  stats: {
    forumTopicsCount: 3,
    forumCommentsCount: 12,
    bestGameScore: 18420,
  },
}
