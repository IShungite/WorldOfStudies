import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import SchoolEntity from '#school/infrastructure/entities/school'
import SubjectEntity from '#school/infrastructure/entities/subject'

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

  @belongsTo(() => SchoolEntity)
  declare school: BelongsTo<typeof SchoolEntity>

  @hasMany(() => SubjectEntity)
  declare subjects: HasMany<typeof SubjectEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
