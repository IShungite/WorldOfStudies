import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import School from '#infrastructure/entities/school'
import ShopCategory from '#infrastructure/entities/shop/shop_category'

export default class Shop extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare schoolId: number

  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  @hasMany(() => ShopCategory)
  declare categories: HasMany<typeof ShopCategory>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
