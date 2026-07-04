import axios from 'axios'

import { API_BASE_URL } from '@/shared/config/env'

import { request } from './apiClient'

/**
 * Форум живёт на нашем собственном сервере (не на API Практикума), поэтому
 * ходим сразу на EXTERNAL_SERVER_URL — без прокси через vite/nginx.
 */
const forumApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export type Emotion = 'like' | 'love' | 'laugh' | 'wow' | 'sad'

export type ReactionSummary = {
  emotion: Emotion
  count: number
}

export type ReplyResponse = {
  id: string
  author: string
  date: string
  body: string
  parentReplyId: string | null
  replies: ReplyResponse[]
}

export type CommentResponse = {
  id: string
  author: string
  date: string
  body: string
  replies: ReplyResponse[]
  reactions: ReactionSummary[]
  myReaction: Emotion | null
}

export type TopicResponse = {
  id: string
  title: string
  description: string
  author: string
  date: string
}

export type TopicDetailResponse = TopicResponse & {
  content: string
  comments: CommentResponse[]
}

export type ReactionState = {
  reactions: ReactionSummary[]
  myReaction: Emotion | null
}

export const getTopics = () =>
  request(() => forumApi.get<TopicResponse[]>('/forum/topics'))

export const getTopicDetail = (topicId: string) =>
  request(() => forumApi.get<TopicDetailResponse>(`/forum/topics/${topicId}`))

export const postTopic = (body: { title: string; body: string }) =>
  request(() => forumApi.post<TopicDetailResponse>('/forum/topics', body))

export const postComment = (topicId: string, body: { body: string }) =>
  request(() =>
    forumApi.post<CommentResponse>(`/forum/topics/${topicId}/comments`, body)
  )

export const postReply = (
  commentId: string,
  body: { body: string; parentReplyId?: string | null }
) =>
  request(() =>
    forumApi.post<ReplyResponse>(`/forum/comments/${commentId}/replies`, body)
  )

export const putReaction = (commentId: string, emotion: Emotion) =>
  request(() =>
    forumApi.put<ReactionState>(`/forum/comments/${commentId}/reactions`, {
      emotion,
    })
  )
