import { Id } from '../../../../shared/id/domain/models/id.js'
import { School } from '../../models/school.js'
import { ISchoolsRepository } from '../../contracts/repositories/schools.repository.js'
import { inject } from '@adonisjs/core'
import { SchoolNotFoundException } from '../../models/school_not_found.exception.js'

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
