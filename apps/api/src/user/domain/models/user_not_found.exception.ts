import { Id } from '#shared/id/domain/models/id'

export class UserNotFoundException extends Error {
  constructor(id: Id) {
    super(`User with id ${id.toString()} not found`)
  }
}
