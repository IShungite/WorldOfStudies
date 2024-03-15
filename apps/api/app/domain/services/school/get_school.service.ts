import { Id } from '#domainModels/id/id'
import { School } from '#domainModels/school/school'
import { GetSchoolUseCase } from '#domainPorts/in/school/get_school.use_case'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'

@inject()
export class GetSchoolService implements GetSchoolUseCase {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async get(schoolId: Id): Promise<School> {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException()
    }

    return school
  }
}
