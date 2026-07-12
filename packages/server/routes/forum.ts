import { Router } from 'express'

import { requireAuth } from '../middleware/requireAuth'
import { createComment } from '../controllers/commentsController'
import { putReaction } from '../controllers/reactionsController'
import { createReply } from '../controllers/repliesController'
import {
  createTopic,
  getTopicDetail,
  getTopics,
} from '../controllers/topicsController'
import { asyncHandler } from '../utils/asyncHandler'

export const forumRouter = Router()

forumRouter.use(requireAuth)

forumRouter.get('/topics', asyncHandler(getTopics))
forumRouter.post('/topics', asyncHandler(createTopic))
forumRouter.get('/topics/:id', asyncHandler(getTopicDetail))
forumRouter.post('/topics/:id/comments', asyncHandler(createComment))
forumRouter.post('/comments/:id/replies', asyncHandler(createReply))
forumRouter.put('/comments/:id/reactions', asyncHandler(putReaction))
