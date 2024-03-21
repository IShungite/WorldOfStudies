import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Shop from '#models/shop/shop'
import ShopProduct from '#models/shop/shop_product'

export default class ShopCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare shopId: number

  @belongsTo(() => Shop)
  declare shop: BelongsTo<typeof Shop>

  @hasMany(() => ShopProduct, {
    foreignKey: 'categoryId',
  })
  declare products: HasMany<typeof ShopProduct>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
