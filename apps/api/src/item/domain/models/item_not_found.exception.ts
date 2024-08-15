import { Id } from '#shared/id/domain/models/id'

export class ItemNotFoundException extends Error {
  constructor(id?: Id) {
    if (id) {
      super(`Item with id ${id.toString()} not found`)
    } else {
      super('Item not found')
    }
  }
}
