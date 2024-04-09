import { Id } from '../../../../shared/id/domain/models/id.js'
import { School, UpdateSchoolDto } from '../../models/school.js'
import { SchoolNotFoundException } from '../../models/school_not_found.exception.js'
import { ISchoolsRepository } from '../../contracts/repositories/schools.repository.js'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateSchoolService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(schoolId: Id, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException(schoolId)
    }

    const newSchool = new School({
      id: school.id,
      name: updateSchoolDto.name ?? school.name,
      promotions: school.promotions,
    })

    return this.schoolsRepository.save(newSchool)
  }
}
