import { Id } from '#domain/models/id/id'

export class SubjectNotFoundException extends Error {
  constructor(id?: Id) {
    if (id) {
      super(`Subject with id ${id.toString()} not found`)
    } else {
      super('Subject not found')
    }
  }
}
