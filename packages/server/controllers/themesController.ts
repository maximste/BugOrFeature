import { Request, Response } from 'express'
import { GameTheme, UserTheme } from '../models'
import { getAuthUser } from '../middleware/requireAuth'

export const getUserTheme = async (
  req: Request,
  res: Response
): Promise<any> => {
  const user = getAuthUser(req)
  console.log(user.id)
  const link = await UserTheme.findOne({
    where: { userId: user.id },
    include: [
      {
        model: GameTheme,
        as: 'theme',
        required: true,
      },
    ],
  })

  const theme = link?.themeId ?? null

  if (!theme) {
    res.json({ theme: { id: 0, title: 'default' } })
    return
  }

  res.json({ theme })
}

export const updateUserTheme = async (
  req: Request,
  res: Response
): Promise<any> => {
  const user = getAuthUser(req)
  if (!user || !user.id) {
    return res.status(401).json({ error: 'Пользователь не авторизован' })
  }

  const { title } = req.body

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res
      .status(400)
      .json({ error: 'Поле title обязательно и должно быть непустой строкой' })
  }

  const theme = await GameTheme.findOne({
    where: { title },
  })

  if (!theme) {
    return res.status(404).json({ error: 'Тема с таким названием не найдена' })
  }

  // Дальше используешь theme.id
  const themeId = theme.id

  try {
    // Ищем запись UserTheme по userId. Если нет — создаём.
    const [userTheme, created] = await UserTheme.findOrCreate({
      where: { userId: user.id },
      defaults: {
        userId: user.id,
        themeId,
      },
    })

    // Если запись уже была, обновляем themeId
    if (!created) {
      await userTheme.update({ themeId })
    }

    res.status(200).json({
      message: created ? 'Тема назначена' : 'Тема обновлена',
      data: userTheme.toJSON(),
    })
  } catch (error) {
    console.error('Ошибка обновления темы пользователя:', error)
    res.status(500).json({ error: 'Не удалось обновить тему' })
  }
}
