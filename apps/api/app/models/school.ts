import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Promotion from '#models/promotion'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Shop from '#models/shop/shop'

export default class School extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => Promotion)
  declare promotions: HasMany<typeof Promotion>

  @hasMany(() => Shop)
  declare shop: HasMany<typeof Shop>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
