import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'

@inject()
export class DeleteSchoolService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(schoolId: Id): Promise<void> {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException(schoolId)
    }

    await this.schoolsRepository.deleteById(schoolId)
  }
}
