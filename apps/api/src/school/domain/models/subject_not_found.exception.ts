import { Id } from '../../../shared/id/domain/models/id.js'

export class SubjectNotFoundException extends Error {
  constructor(id?: Id) {
    if (id) {
      super(`Subject with id ${id.toString()} not found`)
    } else {
      super('Subject not found')
    }
  }
}
