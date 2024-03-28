import { CreateSchoolDto, School } from '#domain/models/school/school'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateSchoolService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = new School(createSchoolDto)

    return this.schoolsRepository.save(school)
  }
}
