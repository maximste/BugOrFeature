import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '../db'

export const EMOTIONS = ['like', 'love', 'laugh', 'wow', 'sad'] as const

export type Emotion = (typeof EMOTIONS)[number]

export interface ReactionAttributes {
  id: string
  commentId: string
  authorId: number
  emotion: Emotion
  createdAt?: Date
  updatedAt?: Date
}

type ReactionCreationAttributes = Optional<
  ReactionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

export class Reaction
  extends Model<ReactionAttributes, ReactionCreationAttributes>
  implements ReactionAttributes
{
  declare id: string
  declare commentId: string
  declare authorId: number
  declare emotion: Emotion
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Reaction.init(
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
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emotion: {
      type: DataTypes.ENUM(...EMOTIONS),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Reaction',
    tableName: 'reactions',
    indexes: [
      {
        unique: true,
        fields: ['commentId', 'authorId'],
        name: 'reactions_comment_author_unique',
      },
    ],
  }
)
