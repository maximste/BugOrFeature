import { Comment, EMOTIONS, Emotion, Reaction } from '../models'

export type ReactionState = {
  reactions: { emotion: Emotion; count: number }[]
  myReaction: Emotion | null
}

export const findCommentById = (id: string): Promise<Comment | null> =>
  Comment.findByPk(id)

/** Один клик — поставить/сменить реакцию, повторный клик той же эмоцией — снять */
export const toggleReaction = async (
  commentId: string,
  authorId: number,
  emotion: Emotion
): Promise<void> => {
  const existing = await Reaction.findOne({ where: { commentId, authorId } })

  if (existing && existing.emotion === emotion) {
    await existing.destroy()
    return
  }

  if (existing) {
    existing.emotion = emotion
    await existing.save()
    return
  }

  await Reaction.create({ commentId, authorId, emotion })
}

export const getReactionState = async (
  commentId: string,
  authorId: number
): Promise<ReactionState> => {
  const reactions = await Reaction.findAll({ where: { commentId } })

  const counts = EMOTIONS.map(emotion => ({
    emotion,
    count: reactions.filter(r => r.emotion === emotion).length,
  }))
  const mine = reactions.find(r => r.authorId === authorId)

  return { reactions: counts, myReaction: mine?.emotion ?? null }
}
