import { Id } from '../../../../shared/id/domain/models/id.js'
import { SchoolNotFoundException } from '../../models/school_not_found.exception.js'
import { ISchoolsRepository } from '../../contracts/repositories/schools.repository.js'
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
