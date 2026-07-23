import { Comment, Reply } from '../models'

export const findCommentById = (id: string): Promise<Comment | null> =>
  Comment.findByPk(id)

export const findReplyById = (id: string): Promise<Reply | null> =>
  Reply.findByPk(id)

export type CreateReplyData = {
  commentId: string
  parentReplyId: string | null
  body: string
  authorId: number
  authorName: string
}

export const createReply = (data: CreateReplyData): Promise<Reply> =>
  Reply.create(data)
