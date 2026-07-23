import axios from 'axios'

import { API_BASE_URL } from '@/shared/config/env'

import { attachApiErrorInterceptor, request } from './apiClient'

// свой сервер, не API Практикума — ходим напрямую на EXTERNAL_SERVER_URL, без прокси
const forumApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
attachApiErrorInterceptor(forumApi)

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
  isOwn: boolean
}

export type TopicDetailResponse = TopicResponse & {
  content: string
  comments: CommentResponse[]
}

export type ReactionState = {
  reactions: ReactionSummary[]
  myReaction: Emotion | null
}

export type TopicsPage = {
  items: TopicResponse[]
  total: number
  page: number
  pageSize: number
}

export const getTopics = (page = 1, pageSize = 10) =>
  request(() =>
    forumApi.get<TopicsPage>('/forum/topics', { params: { page, pageSize } })
  )

export const getTopicDetail = (topicId: string) =>
  request(() => forumApi.get<TopicDetailResponse>(`/forum/topics/${topicId}`))

export const postTopic = (body: { title: string; body: string }) =>
  request(() => forumApi.post<TopicDetailResponse>('/forum/topics', body))

export const deleteTopic = (topicId: string) =>
  request(() => forumApi.delete<void>(`/forum/topics/${topicId}`))

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
