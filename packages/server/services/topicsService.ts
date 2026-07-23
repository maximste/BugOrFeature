import { Comment, Reaction, Reply, Topic } from '../models'

export type PaginatedTopics = {
  items: Topic[]
  total: number
}

export const listTopics = async (
  page: number,
  pageSize: number
): Promise<PaginatedTopics> => {
  const { rows, count } = await Topic.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  })

  return { items: rows, total: count }
}

export type CreateTopicData = {
  title: string
  body: string
  authorId: number
  authorName: string
}

export const createTopic = (data: CreateTopicData): Promise<Topic> =>
  Topic.create(data)

export const findTopicById = (id: string): Promise<Topic | null> =>
  Topic.findByPk(id)

export const deleteTopic = (topic: Topic): Promise<void> => topic.destroy()

export type TopicWithComments = {
  topic: Topic
  comments: Comment[]
  replies: Reply[]
  reactions: Reaction[]
}

export const getTopicWithComments = async (
  topicId: string
): Promise<TopicWithComments | null> => {
  const topic = await Topic.findByPk(topicId)

  if (!topic) {
    return null
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

  return { topic, comments, replies, reactions }
}
