import { Id } from '#domainModels/id/id'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

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
