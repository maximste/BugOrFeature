import { Comment, EMOTIONS, Emotion, Reaction, Reply, Topic } from '../models'

const TEASER_LENGTH = 160

export const truncate = (text: string, length = TEASER_LENGTH): string =>
  text.length > length ? `${text.slice(0, length).trim()}…` : text

export const toTopicListItem = (topic: Topic, currentUserId: number) => ({
  id: topic.id,
  title: topic.title,
  description: truncate(topic.body),
  author: topic.authorName,
  date: topic.createdAt.toISOString(),
  isOwn: topic.authorId === currentUserId,
})

export const toTopicDetail = (topic: Topic, currentUserId: number) => ({
  ...toTopicListItem(topic, currentUserId),
  content: topic.body,
})

const toReactionSummary = (
  commentId: string,
  reactions: Reaction[],
  userId: number
) => {
  const forComment = reactions.filter(r => r.commentId === commentId)

  const counts = EMOTIONS.map(emotion => ({
    emotion,
    count: forComment.filter(r => r.emotion === emotion).length,
  }))

  const mine = forComment.find(r => r.authorId === userId)

  return { counts, myReaction: (mine?.emotion as Emotion) ?? null }
}

const toReplyDto = (
  reply: Reply,
  allReplies: Reply[]
): {
  id: string
  author: string
  date: string
  body: string
  parentReplyId: string | null
  replies: unknown[]
} => ({
  id: reply.id,
  author: reply.authorName,
  date: reply.createdAt.toISOString(),
  body: reply.body,
  parentReplyId: reply.parentReplyId,
  replies: allReplies
    .filter(r => r.parentReplyId === reply.id)
    .map(child => toReplyDto(child, allReplies)),
})

export const toCommentDto = (
  comment: Comment,
  allReplies: Reply[],
  allReactions: Reaction[],
  userId: number
) => {
  const topLevelReplies = allReplies.filter(
    r => r.commentId === comment.id && r.parentReplyId === null
  )

  const { counts, myReaction } = toReactionSummary(
    comment.id,
    allReactions,
    userId
  )

  return {
    id: comment.id,
    author: comment.authorName,
    date: comment.createdAt.toISOString(),
    body: comment.body,
    replies: topLevelReplies.map(reply => toReplyDto(reply, allReplies)),
    reactions: counts,
    myReaction,
  }
}
