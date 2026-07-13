import { Request, Response } from 'express'
import {
  GameTheme,
  type GameThemeCreationAttributes,
} from '../models/GameTheme'

/*export const getGameThemes = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const themes = await GameTheme.findAll()
  res.json({themes: theme})
}*/

export const addGameThemes = async (
  req: Request,
  res: Response
): Promise<any> => {
  const titles = Array.isArray(req.body)
    ? req.body
    : Array.isArray(req.body.themes)
    ? req.body.themes
    : []

  if (titles.length === 0) {
    return res.status(400).json({ error: 'Массив тем пуст' })
  }

  const themesData: GameThemeCreationAttributes[] = titles
    .map((t: string) => (typeof t === 'string' ? { title: t } : t))
    .filter((t: any): t is GameThemeCreationAttributes => {
      // оставляем только те, у которых есть title и он не пустой
      return typeof t.title === 'string' && t.title.trim().length > 0
    })

  if (themesData.length === 0) {
    return res.status(400).json({ error: 'Нет валидных тем для вставки' })
  }

  try {
    const themes = await GameTheme.bulkCreate(themesData, {
      validate: true,
      ignoreDuplicates: true,
      returning: true,
    })

    res.status(201).json({
      count: themes.length,
      items: themes.map(t => t.toJSON()),
    })
  } catch (error) {
    console.error('Ошибка массовой вставки тем:', error)
    res.status(500).json({ error: 'Не удалось добавить темы' })
  }
}
