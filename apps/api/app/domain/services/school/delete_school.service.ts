import { Id } from '#domainModels/id/id'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { DeleteSchoolUseCase } from '#domainPorts/in/school/delete_school.use_case'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteSchoolService implements DeleteSchoolUseCase {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async delete(schoolId: Id): Promise<void> {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException(schoolId)
    }

    await this.schoolsRepository.deleteById(schoolId)
  }
}
