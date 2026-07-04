import type { Emotion, ReactionSummary } from '@/entities/reaction'
import type { Reply } from '@/entities/reply'

export type Comment = {
  id: string
  author: string
  date: string
  body: string
  replies: Reply[]
  reactions: ReactionSummary[]
  myReaction: Emotion | null
}
