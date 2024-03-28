import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import School from '#infrastructure/entities/school'
import Subject from '#infrastructure/entities/subject'

export default class Promotion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare promotions: string

  @column()
  declare year: number

  @column()
  declare schoolId: number

  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  @hasMany(() => Subject)
  declare subjects: HasMany<typeof Subject>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
