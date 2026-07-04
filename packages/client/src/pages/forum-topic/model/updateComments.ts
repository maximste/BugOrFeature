import type {
  CommentResponse,
  ReactionState,
  ReplyResponse,
} from '@/shared/api'

const insertIntoReplyTree = (
  replies: ReplyResponse[],
  parentReplyId: string,
  reply: ReplyResponse
): ReplyResponse[] =>
  replies.map(r =>
    r.id === parentReplyId
      ? { ...r, replies: [...r.replies, reply] }
      : { ...r, replies: insertIntoReplyTree(r.replies, parentReplyId, reply) }
  )

export const addReplyToComments = (
  comments: CommentResponse[],
  commentId: string,
  parentReplyId: string | null,
  reply: ReplyResponse
): CommentResponse[] =>
  comments.map(comment => {
    if (comment.id !== commentId) {
      return comment
    }

    if (parentReplyId == null) {
      return { ...comment, replies: [...comment.replies, reply] }
    }

    return {
      ...comment,
      replies: insertIntoReplyTree(comment.replies, parentReplyId, reply),
    }
  })

export const updateCommentReaction = (
  comments: CommentResponse[],
  commentId: string,
  reactionState: ReactionState
): CommentResponse[] =>
  comments.map(comment =>
    comment.id === commentId ? { ...comment, ...reactionState } : comment
  )
