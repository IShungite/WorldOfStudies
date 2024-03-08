import { Id } from '#domainModels/id/id'

export class UserNotFoundException extends Error {
  constructor(id: Id) {
    super(`User with id ${id.toString()} not found`)
  }
}
