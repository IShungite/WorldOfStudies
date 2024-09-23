import { BaseSchema } from '@adonisjs/lucid/schema'
import { QuestionType } from '#quiz/domain/models/quiz/question'

export default class extends BaseSchema {
  protected tableName = 'questions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.enum('type', [QuestionType.QCM, QuestionType.TEXT_HOLE]).notNullable()
      table.float('points').notNullable()
      table.json('extra').notNullable()
      table.integer('quiz_id').unsigned().references('quizzes.id').onDelete('CASCADE').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
