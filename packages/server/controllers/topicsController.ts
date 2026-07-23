import { Request, Response } from 'express'

import { getAuthUser } from '../middleware/requireAuth'
import * as topicsService from '../services/topicsService'
import {
  toCommentDto,
  toTopicDetail,
  toTopicListItem,
} from '../utils/forumSerializers'
import {
  isUuid,
  MAX_BODY_LENGTH,
  MAX_TITLE_LENGTH,
  sanitizeText,
} from '../utils/sanitize'

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

const parsePositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export const getTopics = async (req: Request, res: Response): Promise<void> => {
  const page = parsePositiveInt(req.query.page, 1)
  const pageSize = Math.min(
    parsePositiveInt(req.query.pageSize, DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE
  )

  const { items, total } = await topicsService.listTopics(page, pageSize)
  const currentUserId = getAuthUser(req).id

  res.json({
    items: items.map(topic => toTopicListItem(topic, currentUserId)),
    total,
    page,
    pageSize,
  })
}

export const createTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const title = sanitizeText(req.body?.title, MAX_TITLE_LENGTH)
  const body = sanitizeText(req.body?.body, MAX_BODY_LENGTH)

  if (!title || !body) {
    res.status(400).json({ reason: 'Заполните заголовок и текст темы' })
    return
  }

  const author = getAuthUser(req)
  const topic = await topicsService.createTopic({
    title,
    body,
    authorId: author.id,
    authorName: author.displayName,
  })

  res.status(201).json(toTopicDetail(topic, author.id))
}

export const getTopicDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params

  if (!isUuid(id)) {
    res.status(404).json({ reason: 'Тема не найдена' })
    return
  }

  const data = await topicsService.getTopicWithComments(id)

  if (!data) {
    res.status(404).json({ reason: 'Тема не найдена' })
    return
  }

  const { topic, comments, replies, reactions } = data
  const currentUserId = getAuthUser(req).id

  res.json({
    ...toTopicDetail(topic, currentUserId),
    comments: comments.map(comment =>
      toCommentDto(comment, replies, reactions, currentUserId)
    ),
  })
}

export const deleteTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params

  if (!isUuid(id)) {
    res.status(404).json({ reason: 'Тема не найдена' })
    return
  }

  const topic = await topicsService.findTopicById(id)

  if (!topic) {
    res.status(404).json({ reason: 'Тема не найдена' })
    return
  }

  if (topic.authorId !== getAuthUser(req).id) {
    res.status(403).json({ reason: 'Можно удалять только свои темы' })
    return
  }

  await topicsService.deleteTopic(topic)
  res.status(204).end()
}
