import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { SubjectNotFoundException } from '#school/domain/models/subject_not_found.exception'
import { Id } from '#shared/id/domain/models/id'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteSubjectService {
  constructor(private readonly subjectsRepository: ISubjectsRepository) {}

  async execute(subjectId: Id): Promise<void> {
    const subject = await this.subjectsRepository.getById(subjectId)

    if (!subject) {
      throw new SubjectNotFoundException(subjectId)
    }

    await this.subjectsRepository.delete(subjectId)
  }
}
