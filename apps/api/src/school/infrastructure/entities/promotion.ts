import CharacterEntity from '#character/infrastructure/entities/character'
import SchoolEntity from '#school/infrastructure/entities/school'
import SubjectEntity from '#school/infrastructure/entities/subject'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

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

  @manyToMany(() => SubjectEntity)
  declare subjects: ManyToMany<typeof SubjectEntity>

  @hasMany(() => CharacterEntity)
  declare characters: HasMany<typeof CharacterEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
