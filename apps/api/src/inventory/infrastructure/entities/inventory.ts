import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CharacterEntity from '#character/infrastructure/entities/character'
import InventoryItemEntity from '#inventory/infrastructure/entities/inventory_item'

export default class Inventory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterId: number

  @belongsTo(() => CharacterEntity)
  declare character: BelongsTo<typeof CharacterEntity>

  @hasMany(() => InventoryItemEntity)
  declare items: HasMany<typeof InventoryItemEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
