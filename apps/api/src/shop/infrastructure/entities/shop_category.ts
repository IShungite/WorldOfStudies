import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ShopProductEntity from '#shop/infrastructure/entities/shop_product'
import ShopEntity from '#shop/infrastructure/entities/shop'

export default class ShopCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare shopId: number

  @belongsTo(() => ShopEntity)
  declare shop: BelongsTo<typeof ShopEntity>

  @hasMany(() => ShopProductEntity, {
    foreignKey: 'categoryId',
  })
  declare products: HasMany<typeof ShopProductEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
