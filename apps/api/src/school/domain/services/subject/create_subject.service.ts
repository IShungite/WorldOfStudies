import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { CreateSubjectDto, Subject } from '#school/domain/models/subject'
import { inject } from '@adonisjs/core'

@inject()
export class CreateSubjectService {
  constructor(private readonly subjectsRepository: ISubjectsRepository) {}

  async execute(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new Subject(createSubjectDto)

    await this.subjectsRepository.save(subject)

    return subject
  }
}
