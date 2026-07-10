import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import { getTopicDetail, putReaction } from '@/shared/api'
import type {
  CommentResponse,
  Emotion,
  ReplyResponse,
  TopicDetailResponse,
} from '@/shared/api'
import { BackLink } from '@/shared/ui/back-link'
import { ForumTopicView } from '@/widgets/forum-topic-view'

import { initForumTopicPage } from '../model/initForumTopicPage'
import {
  addReplyToComments,
  updateCommentReaction,
} from '../model/updateComments'

export const ForumTopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>()
  usePage({ initPage: initForumTopicPage })

  const [topic, setTopic] = useState<TopicDetailResponse | null>(null)
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reactionError, setReactionError] = useState<string | null>(null)

  useEffect(() => {
    if (!topicId) {
      return
    }

    let cancelled = false
    setLoading(true)

    getTopicDetail(topicId)
      .then(data => {
        if (cancelled) {
          return
        }
        setTopic(data)
        setComments(data.comments)
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Топик не найден')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [topicId])

  if (loading) {
    return <p>Загрузка…</p>
  }

  if (error != null || !topic) {
    return (
      <section>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Топик не найден — BugOrFeature</title>
          <meta name="description" content="Топик не найден" />
        </Helmet>
        <p>{error ?? 'Топик не найден.'}</p>
        <BackLink to="/forum">← К темам</BackLink>
      </section>
    )
  }

  const handleCommentAdded = (comment: CommentResponse) => {
    setComments(prev => [...prev, comment])
  }

  const handleReplyAdded = (
    commentId: string,
    parentReplyId: string | null,
    reply: ReplyResponse
  ) => {
    setComments(prev =>
      addReplyToComments(prev, commentId, parentReplyId, reply)
    )
  }

  const handleReact = async (commentId: string, emotion: Emotion) => {
    setReactionError(null)

    try {
      const result = await putReaction(commentId, emotion)
      setComments(prev => updateCommentReaction(prev, commentId, result))
    } catch (err) {
      setReactionError(
        err instanceof Error ? err.message : 'Не удалось поставить реакцию'
      )
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{topic.title} — BugOrFeature</title>
        <meta name="description" content={topic.description} />
      </Helmet>
      {reactionError != null ? <p role="alert">{reactionError}</p> : null}
      <ForumTopicView
        topic={topic}
        comments={comments}
        onCommentAdded={handleCommentAdded}
        onReplyAdded={handleReplyAdded}
        onReact={handleReact}
      />
    </>
  )
}
