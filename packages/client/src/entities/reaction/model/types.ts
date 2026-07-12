export type Emotion = 'like' | 'love' | 'laugh' | 'wow' | 'sad'

export type ReactionSummary = {
  emotion: Emotion
  count: number
}

export const EMOTION_EMOJI: Record<Emotion, string> = {
  like: '👍',
  love: '❤️',
  laugh: '😹',
  wow: '😮',
  sad: '😿',
}
