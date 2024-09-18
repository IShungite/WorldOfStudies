import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { Subject } from '#school/domain/models/subject'
import SubjectEntity from '#school/infrastructure/entities/subject'
import { SubjectStorageMapper } from '#school/infrastructure/mappers/subject_storage.mapper'
import { Id } from '#shared/id/domain/models/id'
import testUtils from '@adonisjs/core/services/test_utils'

export class LucidSubjectsRepository implements ISubjectsRepository {
  async save(subject: Subject): Promise<Subject> {
    await SubjectEntity.updateOrCreate(
      {
        id: Number.parseInt(subject.id.toString(), 10),
      },
      {
        name: subject.name,
      }
    )

    return subject
  }

  async getById(subjectId: Id): Promise<Subject | null> {
    const subject = await SubjectEntity.query().where('id', subjectId.toString()).first()

    return subject ? SubjectStorageMapper.fromLucid(subject) : null
  }

  async delete(subjectId: Id): Promise<void> {
    await SubjectEntity.query().where('id', subjectId.toString()).delete()
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
