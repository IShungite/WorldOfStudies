import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { School, UpdateSchoolDto } from '#school/domain/models/school'

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
