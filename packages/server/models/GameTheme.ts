import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '../db'

export interface GameThemeAttributes {
  id: number
  title: string
}

export type GameThemeCreationAttributes = Optional<GameThemeAttributes, 'id'>

export class GameTheme
  extends Model<GameThemeAttributes, GameThemeCreationAttributes>
  implements GameThemeAttributes
{
  declare id: number
  declare title: string
}

GameTheme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'GameTheme',
    tableName: 'gameThemes',
  }
)
