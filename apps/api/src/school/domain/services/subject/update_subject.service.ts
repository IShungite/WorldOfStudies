import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { Subject, UpdateSubjectDto } from '#school/domain/models/subject'
import { SubjectNotFoundException } from '#school/domain/models/subject_not_found.exception'
import { Id } from '#shared/id/domain/models/id'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateSubjectService {
  constructor(private readonly subjectsRepository: ISubjectsRepository) {}

  async execute(subjectId: Id, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.validate(subjectId)

    const newSubject = new Subject({
      id: subject.id,
      name: updateSubjectDto.name ?? subject.name,
    })

    await this.subjectsRepository.save(newSubject)

    return newSubject
  }

  private async validate(subjectId: Id): Promise<Subject> {
    const subject = await this.subjectsRepository.getById(subjectId)

    if (!subject) {
      throw new SubjectNotFoundException(subjectId)
    }
    return subject
  }
}
