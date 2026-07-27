import { Request, Response } from 'express'

import { getAuthUser } from '../middleware/requireAuth'
import * as repliesService from '../services/repliesService'
import { isUuid, MAX_BODY_LENGTH, sanitizeText } from '../utils/sanitize'

export const createReply = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: commentId } = req.params

  if (
    !isUuid(commentId) ||
    !(await repliesService.findCommentById(commentId))
  ) {
    res.status(404).json({ reason: 'Комментарий не найден' })
    return
  }

  const { parentReplyId } = req.body ?? {}

  if (parentReplyId != null) {
    if (typeof parentReplyId !== 'string' || !isUuid(parentReplyId)) {
      res.status(400).json({ reason: 'Некорректный ответ для цитирования' })
      return
    }

    const parentReply = await repliesService.findReplyById(parentReplyId)

    if (!parentReply || parentReply.commentId !== commentId) {
      res.status(400).json({ reason: 'Некорректный ответ для цитирования' })
      return
    }
  }

  const body = sanitizeText(req.body?.body, MAX_BODY_LENGTH)

  if (!body) {
    res.status(400).json({ reason: 'Ответ не может быть пустым' })
    return
  }

  const author = getAuthUser(req)
  const reply = await repliesService.createReply({
    commentId,
    parentReplyId: parentReplyId ?? null,
    body,
    authorId: author.id,
    authorName: author.displayName,
  })

  res.status(201).json({
    id: reply.id,
    author: reply.authorName,
    date: reply.createdAt.toISOString(),
    body: reply.body,
    parentReplyId: reply.parentReplyId,
    replies: [],
  })
}
