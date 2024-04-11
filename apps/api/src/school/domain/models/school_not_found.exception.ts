import { Id } from '#shared/id/domain/models/id'

export class SchoolNotFoundException extends Error {
  constructor(id?: Id) {
    if (id) {
      super(`School with id ${id.toString()} not found`)
    } else {
      super('School not found')
    }
  }
}
