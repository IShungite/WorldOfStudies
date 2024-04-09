import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import QuizEntity from './quiz.js'
import type { QuestionType } from '../../domain/models/quiz/question.js'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare quizId: number

  @belongsTo(() => QuizEntity)
  declare quiz: BelongsTo<typeof QuizEntity>

  @column()
  declare type: QuestionType

  @column()
  declare points: number

  @column()
  declare extra: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
