import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import QuestionEntity from '#quiz/infrastructure/entities/question'
import SubjectEntity from '#school/infrastructure/entities/subject'
import { QuizType } from '#quiz/domain/models/quiz/quiz'

export default class Quiz extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => QuestionEntity)
  declare questions: HasMany<typeof QuestionEntity>

  @column()
  declare subjectId: number

  @belongsTo(() => SubjectEntity)
  declare subject: BelongsTo<typeof SubjectEntity>

  @column()
  declare type: QuizType

  @column.dateTime()
  declare startAt: DateTime | null

  @column.dateTime()
  declare endAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
