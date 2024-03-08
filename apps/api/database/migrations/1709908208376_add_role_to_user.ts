import { role } from '#domainModels/user/role'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'
  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('role', [role.ADMIN, role.SCHOOL_ADMIN, role.TEACHER, role.STUDENT])
        .defaultTo(role.STUDENT)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
    })
  }
}
