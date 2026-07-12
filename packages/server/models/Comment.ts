import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '../db'

export interface CommentAttributes {
  id: string
  topicId: string
  body: string
  authorId: number
  authorName: string
  createdAt?: Date
  updatedAt?: Date
}

type CommentCreationAttributes = Optional<
  CommentAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

export class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  declare id: string
  declare topicId: string
  declare body: string
  declare authorId: number
  declare authorName: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    topicId: {
      type: DataTypes.UUID,
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
    modelName: 'Comment',
    tableName: 'comments',
  }
)
