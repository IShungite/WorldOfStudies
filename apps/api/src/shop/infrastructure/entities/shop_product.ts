import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ShopCategoryEntity from '#shop/infrastructure/entities/shop_category'
import ItemEntity from '#item/infrastructure/entities/item'

export default class ShopProduct extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare price: number

  @column()
  declare itemId: number

  @belongsTo(() => ItemEntity)
  declare item: BelongsTo<typeof ItemEntity>

  @column()
  declare categoryId: number

  @belongsTo(() => ShopCategoryEntity)
  declare category: BelongsTo<typeof ShopCategoryEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
