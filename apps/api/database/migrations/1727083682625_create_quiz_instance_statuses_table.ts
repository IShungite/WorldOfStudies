import { QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quiz_instances'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('status', [QuizInstanceStatus.IN_PROGRESS, QuizInstanceStatus.COMPLETED])
        .notNullable()
        .defaultTo(QuizInstanceStatus.IN_PROGRESS)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })
  }
}
