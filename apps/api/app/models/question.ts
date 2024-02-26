import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { QuestionQcmContent, QuestionHoleTextContent } from '#domain/quiz/types'
export default class Question extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare content: QuestionQcmContent | QuestionHoleTextContent

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
