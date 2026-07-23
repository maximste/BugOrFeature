import { Comment, Topic } from '../models'

export const findTopicById = (id: string): Promise<Topic | null> =>
  Topic.findByPk(id)

export type CreateCommentData = {
  topicId: string
  body: string
  authorId: number
  authorName: string
}

export const createComment = (data: CreateCommentData): Promise<Comment> =>
  Comment.create(data)
