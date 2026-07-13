import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '../db'

export interface UserThemeAttributes {
  id: number
  userId: number
  themeId: number
}

type UserThemeCreationAttributes = Optional<UserThemeAttributes, 'id'>

export class UserTheme
  extends Model<UserThemeAttributes, UserThemeCreationAttributes>
  implements UserThemeAttributes
{
  declare id: number
  declare userId: number
  declare themeId: number
}

UserTheme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    themeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserTheme',
    tableName: 'userThemes',
  }
)
