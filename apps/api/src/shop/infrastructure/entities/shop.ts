import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import SchoolEntity from '#school/infrastructure/entities/school'
import ShopCategoryEntity from '#shop/infrastructure/entities/shop_category'

export default class Shop extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare schoolId: number

  @belongsTo(() => SchoolEntity)
  declare school: BelongsTo<typeof SchoolEntity>

  @hasMany(() => ShopCategoryEntity)
  declare categories: HasMany<typeof ShopCategoryEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
