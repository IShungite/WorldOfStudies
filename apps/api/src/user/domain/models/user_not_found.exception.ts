import { Id } from '../../../shared/id/domain/models/id.js'

export class UserNotFoundException extends Error {
  constructor(id: Id) {
    super(`User with id ${id.toString()} not found`)
  }
}
