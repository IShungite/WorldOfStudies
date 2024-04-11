import { Id } from '#shared/id/domain/models/id'

export class ShopNotFoundException extends Error {
  constructor(id?: Id) {
    if (id) {
      super(`Shop with id ${id.toString()} not found`)
    } else {
      super('Shop not found')
    }
  }
}
