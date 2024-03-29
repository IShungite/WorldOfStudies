import { Id } from '#domain/models/id/id'

export class ShopCategoryNotFoundException extends Error {
  constructor(id: Id) {
    super(`Category with id ${id.toString()} not found`)
  }
}
