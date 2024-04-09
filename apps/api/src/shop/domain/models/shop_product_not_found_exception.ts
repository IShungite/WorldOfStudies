import { Id } from '../../../shared/id/domain/models/id.js'

export class ShopProductNotFoundException extends Error {
  constructor(id?: Id) {
    if (id) {
      super(`Product with id ${id.toString()} not found`)
    } else {
      super('Product not found')
    }
  }
}
