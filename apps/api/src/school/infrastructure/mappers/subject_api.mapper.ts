import { Subject } from '#school/domain/models/subject'

export class SubjectApiMapper {
  static toResponse(subject: Subject): { id: string; name: string } {
    return {
      id: subject.id.toString(),
      name: subject.name,
    }
  }
}
