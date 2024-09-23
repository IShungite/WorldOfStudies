import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import QuizEntity from '#quiz/infrastructure/entities/quiz'
import CharacterEntity from '#character/infrastructure/entities/character'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import UserAnswerEntity from '#quiz/infrastructure/entities/user_answer'
import { QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'

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

  @column()
  declare status: QuizInstanceStatus

  @hasMany(() => UserAnswerEntity)
  declare userAnswers: HasMany<typeof UserAnswerEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
