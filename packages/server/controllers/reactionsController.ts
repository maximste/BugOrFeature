import { Request, Response } from 'express'

import { getAuthUser } from '../middleware/requireAuth'
import { Comment, EMOTIONS, Emotion, Reaction } from '../models'
import { isUuid } from '../utils/sanitize'

const isEmotion = (value: unknown): value is Emotion =>
  typeof value === 'string' && (EMOTIONS as readonly string[]).includes(value)

export const putReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: commentId } = req.params

  if (!isUuid(commentId) || !(await Comment.findByPk(commentId))) {
    res.status(404).json({ reason: 'Комментарий не найден' })
    return
  }

  const { emotion } = req.body ?? {}

  if (!isEmotion(emotion)) {
    res.status(400).json({ reason: 'Некорректная реакция' })
    return
  }

  const authorId = getAuthUser(req).id
  const existing = await Reaction.findOne({ where: { commentId, authorId } })

  if (existing && existing.emotion === emotion) {
    // повторный клик по той же эмоции — снимаем реакцию
    await existing.destroy()
  } else if (existing) {
    existing.emotion = emotion
    await existing.save()
  } else {
    await Reaction.create({ commentId, authorId, emotion })
  }

  const reactions = await Reaction.findAll({ where: { commentId } })
  const counts = EMOTIONS.map(e => ({
    emotion: e,
    count: reactions.filter(r => r.emotion === e).length,
  }))
  const mine = reactions.find(r => r.authorId === authorId)

  res.json({ reactions: counts, myReaction: mine?.emotion ?? null })
}
