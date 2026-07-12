import { sequelize } from '../db'
import { Topic } from './Topic'
import { Comment } from './Comment'
import { Reply } from './Reply'
import { Reaction } from './Reaction'

Topic.hasMany(Comment, {
  foreignKey: 'topicId',
  as: 'comments',
  onDelete: 'CASCADE',
})
Comment.belongsTo(Topic, { foreignKey: 'topicId', as: 'topic' })

Comment.hasMany(Reply, {
  foreignKey: 'commentId',
  as: 'replies',
  onDelete: 'CASCADE',
})
Reply.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' })

Reply.hasMany(Reply, {
  foreignKey: 'parentReplyId',
  as: 'children',
  onDelete: 'CASCADE',
})
Reply.belongsTo(Reply, { foreignKey: 'parentReplyId', as: 'parent' })

Comment.hasMany(Reaction, {
  foreignKey: 'commentId',
  as: 'reactions',
  onDelete: 'CASCADE',
})
Reaction.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' })

/** Создаёт/обновляет таблицы по моделям. alter — только в dev, в проде нужны миграции. */
export const syncModels = async (): Promise<void> => {
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
}

export { Topic, Comment, Reply, Reaction }
export { EMOTIONS } from './Reaction'
export type { Emotion } from './Reaction'
