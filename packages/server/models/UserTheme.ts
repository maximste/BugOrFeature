import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '../db'

export interface UserThemeAttributes {
  id: number
  userId: number
  themeCode: string
}

type UserThemeCreationAttributes = Optional<UserThemeAttributes, 'id'>

export class UserTheme
  extends Model<UserThemeAttributes, UserThemeCreationAttributes>
  implements UserThemeAttributes
{
  declare id: number
  declare userId: number
  declare themeCode: string
}

UserTheme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    themeCode: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'theme_code',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
  },
  {
    sequelize,
    modelName: 'UserTheme',
    tableName: 'user_themes',
    indexes: [
      {
        unique: true,
        fields: ['user_id'],
      },
      { fields: ['theme_code'] },
    ],
  }
)
