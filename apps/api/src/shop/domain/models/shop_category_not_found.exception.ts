import { Id } from '#shared/id/domain/models/id'

export class ShopCategoryNotFoundException extends Error {
  constructor(id?: Id) {
    if (id) {
      super(`Category with id ${id.toString()} not found`)
    } else {
      super('Category not found')
    }
  }
}
