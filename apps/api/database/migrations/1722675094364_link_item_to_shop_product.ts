import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shop_products'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('name')
      table.integer('item_id').unsigned().references('items.id').onDelete('CASCADE').notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('item_id')
      table.string('name').notNullable()
    })
  }
}
