import { Request, Response } from 'express'

import { getAuthUser } from '../middleware/requireAuth'
import { Comment, EMOTIONS, Topic } from '../models'
import { isUuid, MAX_BODY_LENGTH, sanitizeText } from '../utils/sanitize'

export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: topicId } = req.params

  if (!isUuid(topicId) || !(await Topic.findByPk(topicId))) {
    res.status(404).json({ reason: 'Тема не найдена' })
    return
  }

  const body = sanitizeText(req.body?.body, MAX_BODY_LENGTH)

  if (!body) {
    res.status(400).json({ reason: 'Комментарий не может быть пустым' })
    return
  }

  const author = getAuthUser(req)
  const comment = await Comment.create({
    topicId,
    body,
    authorId: author.id,
    authorName: author.displayName,
  })

  res.status(201).json({
    id: comment.id,
    author: comment.authorName,
    date: comment.createdAt.toISOString(),
    body: comment.body,
    replies: [],
    reactions: EMOTIONS.map(emotion => ({ emotion, count: 0 })),
    myReaction: null,
  })
}
