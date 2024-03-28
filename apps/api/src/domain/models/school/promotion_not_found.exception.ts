import { Id } from '#domain/models/id/id'

export class PromotionNotFoundException extends Error {
  constructor(id?: Id) {
    if (id) {
      super(`Promotion with id ${id.toString()} not found`)
    } else {
      super('Promotion not found')
    }
  }
}
