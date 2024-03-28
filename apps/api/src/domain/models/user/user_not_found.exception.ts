import { Id } from '#domain/models/id/id'

export class UserNotFoundException extends Error {
  constructor(id: Id) {
    super(`User with id ${id.toString()} not found`)
  }
}
