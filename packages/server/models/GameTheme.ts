import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '../db'

export interface GameThemeAttributes {
  id: number
  themeCode: string
}

export type GameThemeCreationAttributes = Optional<GameThemeAttributes, 'id'>

export class GameTheme
  extends Model<GameThemeAttributes, GameThemeCreationAttributes>
  implements GameThemeAttributes
{
  declare id: number
  declare themeCode: string
}

GameTheme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    themeCode: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      field: 'theme_code',
    },
  },
  {
    sequelize,
    modelName: 'GameTheme',
    tableName: 'game_themes',
  }
)
