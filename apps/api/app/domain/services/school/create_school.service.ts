import { CreateSchoolDto, School } from '#domainModels/school'
import { CreateSchoolUseCase } from '#domainPorts/in/school/create_school.use_case'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateSchoolService implements CreateSchoolUseCase {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = new School(createSchoolDto)

    return this.schoolsRepository.save(school)
  }
}
