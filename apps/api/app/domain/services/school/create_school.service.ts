import { CreateSchoolDto, School } from '#domainModels/school/school'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateSchoolService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = new School(createSchoolDto)

    return this.schoolsRepository.save(school)
  }
}
