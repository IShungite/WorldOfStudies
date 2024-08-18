import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import InventoryEntity from '#inventory/infrastructure/entities/inventory'
import ItemEntity from '#item/infrastructure/entities/item'

export default class InventoryItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare inventoryId: number

  @belongsTo(() => InventoryEntity)
  declare inventory: BelongsTo<typeof InventoryEntity>

  @column()
  declare itemId: number

  @belongsTo(() => ItemEntity)
  declare item: BelongsTo<typeof ItemEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
