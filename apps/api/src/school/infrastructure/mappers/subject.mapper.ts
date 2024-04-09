import { Subject } from '../../domain/models/subject.js'

export class SubjectMapper {
  static toResponse(subject: Subject): { id: string; name: string } {
    return {
      id: subject.id.toString(),
      name: subject.name,
    }
  }
}
