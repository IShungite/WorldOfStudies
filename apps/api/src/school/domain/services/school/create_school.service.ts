import { CreateSchoolDto, School } from '../../models/school.js'
import { ISchoolsRepository } from '../../contracts/repositories/schools.repository.js'
import { inject } from '@adonisjs/core'

@inject()
export class CreateSchoolService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = new School(createSchoolDto)

    return this.schoolsRepository.save(school)
  }
}
