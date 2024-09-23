import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quizzes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('type', ['exam', 'practice']).after('name')
      table.dateTime('start_at').nullable().after('type')
      table.dateTime('end_at').nullable().after('start_at')

      // set type to practice for all quizzes
      this.schema.raw("UPDATE quizzes SET type='practice'")
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('type')
      table.dropColumn('start_at')
      table.dropColumn('end_at')
    })
  }
}
