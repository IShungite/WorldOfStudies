import { Subject } from '#school/domain/models/subject'
import { Id } from '#shared/id/domain/models/id'

export abstract class ISubjectsRepository {
  abstract save(subject: Subject): Promise<Subject>
  abstract getById(subjectId: Id): Promise<Subject | null>
  abstract empty(): Promise<void>
}
