import type { Comment } from '@/entities/comment'
import type { TopicDetail } from '@/entities/topic'

// мок временный, удалится вместе с остальными моками при переходе на реальный API
const mockComment = (
  c: Pick<Comment, 'id' | 'author' | 'date' | 'body'>
): Comment => ({
  ...c,
  replies: [],
  reactions: [],
  myReaction: null,
})

export const forumTopicDetailMock: Record<
  string,
  { topic: TopicDetail; comments: Comment[] }
> = {
  '1': {
    topic: {
      id: '1',
      title: 'Топик номер три',
      description: 'Какой-то насущный вопрос',
      author: 'Барсик',
      date: '2026-05-13',
      content: 'Какой-то текст топика. Подробнее раскрываем тему здесь.',
    },
    comments: [
      mockComment({
        id: 'c1',
        author: 'Барсик',
        date: '2026-05-13',
        body: 'Согласен, полезный топик.',
      }),
      mockComment({
        id: 'c2',
        author: 'Рыжик',
        date: '2026-05-13',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Развёрнутый ответ для проверки переносов и длинного текста.',
      }),
    ],
  },
  '2': {
    topic: {
      id: '2',
      title: 'Топик номер два',
      description: 'Очень смешной анекдот',
      author: 'Рыжик',
      date: '2026-05-13',
      content: 'Полный текст анекдота и обсуждение.',
    },
    comments: [
      mockComment({
        id: 'c3',
        author: 'Мурзик',
        date: '2026-05-13',
        body: 'Ха-ха, спасибо!',
      }),
    ],
  },
  '3': {
    topic: {
      id: '3',
      title: 'Топик номер один',
      description: 'Подробнее о главном.',
      author: 'Мурзик',
      date: '2026-05-13',
      content: 'Какой-то текст топика.',
    },
    comments: [
      mockComment({
        id: 'c4',
        author: 'Барсик',
        date: '2026-05-13',
        body: 'Короткий комментарий.',
      }),
      mockComment({
        id: 'c5',
        author: 'Рыжик',
        date: '2026-05-13',
        body: 'Второй ответ в треде.',
      }),
    ],
  },
  '4': {
    topic: {
      id: '4',
      title: 'Без комментариев (демо)',
      description: 'Пустой список комментариев для проверки UI.',
      author: 'Мурзик',
      date: '2026-05-13',
      content: 'Откройте этот топик, чтобы увидеть экран без ответов.',
    },
    comments: [],
  },
}

export const getForumTopicDetailMock = (topicId: string | undefined) => {
  if (!topicId) {
    return undefined
  }
  return forumTopicDetailMock[topicId]
}
