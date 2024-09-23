import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Question from '#quiz/infrastructure/entities/question'
import CharacterEntity from '#character/infrastructure/entities/character'
import QuizInstance from '#quiz/infrastructure/entities/quiz_instance'
import { QuestionType } from '#quiz/domain/models/quiz/question'

export default class UserAnswer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: QuestionType

  @column()
  declare quizInstanceId: number

  @belongsTo(() => QuizInstance)
  declare quizInstance: BelongsTo<typeof QuizInstance>

  @column()
  declare questionId: number

  @belongsTo(() => Question)
  declare question: BelongsTo<typeof Question>

  @column()
  declare characterId: number

  @belongsTo(() => CharacterEntity)
  declare character: BelongsTo<typeof CharacterEntity>

  @column()
  declare extra: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
