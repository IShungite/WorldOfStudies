import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { CreateSchoolDto, School } from '#school/domain/models/school'

@inject()
export class CreateSchoolService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = new School(createSchoolDto)

    return this.schoolsRepository.save(school)
  }
}
