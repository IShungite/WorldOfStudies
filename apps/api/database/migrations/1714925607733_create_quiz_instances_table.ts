import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quiz_instances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('character_id')
        .unsigned()
        .references('characters.id')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('quiz_id').unsigned().references('quizzes.id').onDelete('CASCADE').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
