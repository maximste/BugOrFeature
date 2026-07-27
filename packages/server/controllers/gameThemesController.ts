import { Request, Response } from 'express'
import {
  GameTheme,
  type GameThemeCreationAttributes,
} from '../models/GameTheme'

export const addGameThemes = async (
  req: Request,
  res: Response
): Promise<any> => {
  const themeCodes = Array.isArray(req.body)
    ? req.body
    : Array.isArray(req.body.themes)
    ? req.body.themes
    : []

  if (themeCodes.length === 0) {
    return res.status(400).json({ error: 'Массив тем пуст' })
  }

  const themesData: GameThemeCreationAttributes[] = themeCodes
    .map((t: string) => (typeof t === 'string' ? { themeCode: t } : t))
    .filter((t: any): t is GameThemeCreationAttributes => {
      // оставляем только те, у которых есть themeCode и он не пустой
      return typeof t.themeCode === 'string' && t.themeCode.trim().length > 0
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
    res.status(500).json({ error: 'Не удалось добавить темы' })
  }
}
