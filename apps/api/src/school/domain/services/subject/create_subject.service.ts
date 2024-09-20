import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { CreateSubjectDto, Subject } from '#school/domain/models/subject'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { PromotionNotFoundException } from '#school/domain/models/promotion_not_found.exception'
import { Promotion } from '#school/domain/models/promotion'
import { School } from '#school/domain/models/school'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'

@inject()
export class CreateSubjectService {
  constructor(private readonly subjectsRepository: ISubjectsRepository) {}

  async execute(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new Subject(createSubjectDto)

    await this.subjectsRepository.save(subject)

    return subject
  }
}
