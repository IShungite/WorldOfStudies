import { Id } from '#domainModels/id/id'
import { School } from '#domainModels/school/school'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'

@inject()
export class GetSchoolService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(schoolId: Id): Promise<School> {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException()
    }

    return school
  }
}
