import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'school_admin'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('school_id')
        .unsigned()
        .references('schools.id')
        .notNullable()
        .onDelete('cascade')
      table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('cascade')
      table.unique(['school_id', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
