import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quizzes'

  async up() {
    this.schema.alterTable('quizzes', (table) => {
      table.integer('subject_id').unsigned().references('subjects.id')
    })
  }

  async down() {
    this.schema.alterTable('quizzes', (table) => {
      table.dropColumn('subject_id')
    })
  }
}
