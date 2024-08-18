import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import UserEntity from '#user/infrastructure/entities/user'
import PromotionEntity from '#school/infrastructure/entities/promotion'

export default class Character extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare userId: number

  @belongsTo(() => UserEntity)
  declare user: BelongsTo<typeof UserEntity>

  @column()
  declare promotionId: number

  @belongsTo(() => PromotionEntity)
  declare promotion: BelongsTo<typeof PromotionEntity>

  @column()
  declare berries: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
