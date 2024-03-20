import { Subject } from '#domainModels/school/subject'

export class SubjectMapper {
  static toResponse(subject: Subject): { id: string; name: string } {
    return {
      id: subject.id.toString(),
      name: subject.name,
    }
  }
}