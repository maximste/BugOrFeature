import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '../db'

export interface ReplyAttributes {
  id: string
  commentId: string
  parentReplyId: string | null
  body: string
  authorId: number
  authorName: string
  createdAt?: Date
  updatedAt?: Date
}

type ReplyCreationAttributes = Optional<
  ReplyAttributes,
  'id' | 'parentReplyId' | 'createdAt' | 'updatedAt'
>

export class Reply
  extends Model<ReplyAttributes, ReplyCreationAttributes>
  implements ReplyAttributes
{
  declare id: string
  declare commentId: string
  declare parentReplyId: string | null
  declare body: string
  declare authorId: number
  declare authorName: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Reply.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    commentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    parentReplyId: {
      type: DataTypes.UUID,
      allowNull: true,
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
    modelName: 'Reply',
    tableName: 'replies',
  }
)
