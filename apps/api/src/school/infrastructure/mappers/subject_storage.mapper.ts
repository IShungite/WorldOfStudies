import { Subject } from '#school/domain/models/subject'
import SubjectEntity from '#school/infrastructure/entities/subject'
import { Id } from '#shared/id/domain/models/id'

export class SubjectStorageMapper {
  static fromLucid(subject: SubjectEntity): Subject {
    return new Subject({
      id: new Id(subject.id.toString()),
      name: subject.name,
    })
  }
}
