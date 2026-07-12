import { Request, Response } from 'express'

import { getAuthUser } from '../middleware/requireAuth'
import { Comment, Reaction, Reply, Topic } from '../models'
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

export const getTopics = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const topics = await Topic.findAll({ order: [['createdAt', 'DESC']] })
  res.json(topics.map(toTopicListItem))
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
  const topic = await Topic.create({
    title,
    body,
    authorId: author.id,
    authorName: author.displayName,
  })

  res.status(201).json(toTopicDetail(topic))
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

  const topic = await Topic.findByPk(id)

  if (!topic) {
    res.status(404).json({ reason: 'Тема не найдена' })
    return
  }

  const comments = await Comment.findAll({
    where: { topicId: topic.id },
    order: [['createdAt', 'ASC']],
  })
  const commentIds = comments.map(comment => comment.id)

  const [replies, reactions] = await Promise.all([
    Reply.findAll({
      where: { commentId: commentIds },
      order: [['createdAt', 'ASC']],
    }),
    Reaction.findAll({ where: { commentId: commentIds } }),
  ])

  res.json({
    ...toTopicDetail(topic),
    comments: comments.map(comment =>
      toCommentDto(comment, replies, reactions, getAuthUser(req).id)
    ),
  })
}
