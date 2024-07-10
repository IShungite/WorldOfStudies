import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_answers'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('quiz_instance_id')
        .unsigned()
        .references('quiz_instances.id')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
