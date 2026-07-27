import { Request, Response } from 'express'

import { getAuthUser } from '../middleware/requireAuth'
import { EMOTIONS, Emotion } from '../models'
import * as reactionsService from '../services/reactionsService'
import { isUuid } from '../utils/sanitize'

const isEmotion = (value: unknown): value is Emotion =>
  typeof value === 'string' && (EMOTIONS as readonly string[]).includes(value)

export const putReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: commentId } = req.params

  if (
    !isUuid(commentId) ||
    !(await reactionsService.findCommentById(commentId))
  ) {
    res.status(404).json({ reason: 'Комментарий не найден' })
    return
  }

  const { emotion } = req.body ?? {}

  if (!isEmotion(emotion)) {
    res.status(400).json({ reason: 'Некорректная реакция' })
    return
  }

  const authorId = getAuthUser(req).id

  await reactionsService.toggleReaction(commentId, authorId, emotion)

  const state = await reactionsService.getReactionState(commentId, authorId)

  res.json(state)
}
