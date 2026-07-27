import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { getUserTheme, updateUserTheme } from '../controllers/themesController'
import { requireAuth } from '../middleware/requireAuth'
import { addGameThemes } from '../controllers/gameThemesController'

export const themeRouter = Router()

themeRouter.post('/add', asyncHandler(addGameThemes))

themeRouter.use(requireAuth)
themeRouter.get('/', asyncHandler(getUserTheme))
themeRouter.post('/update', asyncHandler(updateUserTheme))
