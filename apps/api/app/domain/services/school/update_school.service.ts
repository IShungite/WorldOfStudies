import { Id } from '#domainModels/id/id'
import { School, UpdateSchoolDto } from '#domainModels/school/school'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { UpdateSchoolUseCase } from '#domainPorts/in/school/update_school.use_case'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateSchoolService implements UpdateSchoolUseCase {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async update(schoolId: Id, updateSchoolDto: UpdateSchoolDto): Promise<School> {
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
