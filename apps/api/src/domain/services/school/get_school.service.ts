import { Id } from '#domain/models/id/id'
import { School } from '#domain/models/school/school'
import { ISchoolsRepository } from '#domain/ports/out/schools.repository'
import { inject } from '@adonisjs/core'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'

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
