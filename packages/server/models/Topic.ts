import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '../db'

export interface TopicAttributes {
  id: string
  title: string
  body: string
  authorId: number
  authorName: string
  createdAt?: Date
  updatedAt?: Date
}

type TopicCreationAttributes = Optional<
  TopicAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

export class Topic
  extends Model<TopicAttributes, TopicCreationAttributes>
  implements TopicAttributes
{
  declare id: string
  declare title: string
  declare body: string
  declare authorId: number
  declare authorName: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Topic.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    authorName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Topic',
    tableName: 'topics',
  }
)
