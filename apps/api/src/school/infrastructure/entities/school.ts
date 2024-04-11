import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import PromotionEntity from '#school/infrastructure/entities/promotion'
import ShopEntity from '#shop/infrastructure/entities/shop'

export default class School extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => PromotionEntity)
  declare promotions: HasMany<typeof PromotionEntity>

  @hasMany(() => ShopEntity)
  declare shop: HasMany<typeof ShopEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
