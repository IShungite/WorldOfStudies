import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Promotion from '#infrastructure/entities/promotion'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Subject extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare promotionId: number

  @belongsTo(() => Promotion)
  declare promotion: BelongsTo<typeof Promotion>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
