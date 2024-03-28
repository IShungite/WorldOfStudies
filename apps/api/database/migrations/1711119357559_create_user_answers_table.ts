import { BaseSchema } from '@adonisjs/lucid/schema'
import { questionType } from '#domain/models/quiz/question'

export default class extends BaseSchema {
  protected tableName = 'user_answers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.enum('type', [questionType.QCM, questionType.TEXT_HOLE]).notNullable()
      table
        .integer('question_id')
        .unsigned()
        .references('questions.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('character_id')
        .unsigned()
        .references('characters.id')
        .onDelete('CASCADE')
        .notNullable()
      table.json('extra').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
