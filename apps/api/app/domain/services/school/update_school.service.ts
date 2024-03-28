import { Id } from '#domainModels/id/id'
import { School, UpdateSchoolDto } from '#domainModels/school/school'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
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
