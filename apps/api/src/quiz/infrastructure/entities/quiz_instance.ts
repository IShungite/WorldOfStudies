import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import QuizEntity from '#quiz/infrastructure/entities/quiz'
import CharacterEntity from '#character/infrastructure/entities/character'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class QuizInstance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterId: number

  @belongsTo(() => CharacterEntity)
  declare character: BelongsTo<typeof CharacterEntity>

  @column()
  declare quizId: number

  @belongsTo(() => QuizEntity)
  declare quiz: BelongsTo<typeof QuizEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
