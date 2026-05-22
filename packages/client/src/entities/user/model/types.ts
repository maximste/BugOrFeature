export type UserProfileStats = {
  forumTopicsCount: number
  forumCommentsCount: number
  bestGameScore: number | null
}

export type UserProfile = {
  id: string
  displayName: string
  handle: string
  joinedLabel: string
  bio: string
  avatarUrl?: string | null
  stats: UserProfileStats
}
