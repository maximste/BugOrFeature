import { Request, Response } from 'express'
import { GameTheme, UserTheme } from '../models'
import { getAuthUser } from '../middleware/requireAuth'

export interface UserThemeResponse {
  id: number
  userId: number
  themeCode: string
  theme?: {
    id: number
    themeCode: string
  }
}

export const getUserTheme = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getAuthUser(req)
  if (!user || !user.id) {
    res.status(401).json({ themeCode: 'light' }) // направлять в ЛС
  }

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

  // Если записи нет (пользователь без темы ИЛИ тема не найдена) — отдаём дефолт
  if (!link) {
    res.json({ themeCode: 'light' })
    return
  }

  // Возвращаем согласованную структуру: themeCode всегда строка
  res.json({
    themeCode: link.themeCode, // код темы (из UserTheme)
  })
}

export const updateUserTheme = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getAuthUser(req)
  if (!user || !user.id) {
    res.status(401).json({ themeCode: 'light' }) // направлять в ЛС
  }

  const { themeCode } = req.body

  // Валидируем, что прислали именно themeCode (строка, не пустая)
  if (
    !themeCode ||
    typeof themeCode !== 'string' ||
    themeCode.trim().length === 0
  ) {
    res.status(400).json({
      error: 'Поле themeCode обязательно и должно быть непустой строкой',
    })
  }

  const theme = await GameTheme.findOne({
    where: { themeCode },
  })

  if (!theme) {
    res.status(404).json({ error: 'Тема с таким кодом не найдена' })
    return
  }

  try {
    const [userTheme, created] = await UserTheme.upsert(
      {
        userId: user.id,
        themeCode: theme.themeCode,
      },
      {
        returning: true,
      }
    )

    res.status(200).json({
      message: created ? 'Тема назначена' : 'Тема обновлена',
      data: userTheme.toJSON(),
    })
  } catch (error) {
    console.error('Ошибка обновления темы пользователя:', error)

    res.status(500).json({ error: 'Не удалось обновить тему' })
  }
}
