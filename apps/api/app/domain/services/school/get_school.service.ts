import { Id } from '#domainModels/id'
import { School } from '#domainModels/school'
import { GetSchoolUseCase } from '#domainPorts/in/school/get_school.use_case'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class GetSchoolService implements GetSchoolUseCase {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async get(schoolId: Id): Promise<School | null> {
    const school = await this.schoolsRepository.getById(schoolId)
    return school
  }
}
