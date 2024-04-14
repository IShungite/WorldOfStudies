import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'characters'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('promotion_id')
        .unsigned()
        .references('promotions.id')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('promotion_id')
    })
  }
}
