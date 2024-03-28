import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Question from '#models/question'
import Character from '#models/character'
import type { QuestionType } from '#domainModels/quiz/question'

export default class UserAnswer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: QuestionType

  @column()
  declare questionId: number

  @belongsTo(() => Question)
  declare question: BelongsTo<typeof Question>

  @column()
  declare characterId: number

  @belongsTo(() => Character)
  declare character: BelongsTo<typeof Character>

  @column()
  declare extra: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
