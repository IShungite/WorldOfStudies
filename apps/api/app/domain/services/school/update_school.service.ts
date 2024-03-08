import { Id } from '#domainModels/id'
import { School, UpdateSchoolDto } from '#domainModels/school'
import { UpdateSchoolUseCase } from '#domainPorts/in/school/update_school.use_case'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateSchoolService implements UpdateSchoolUseCase {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async update(schoolId: Id, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new Error('School not found')
    }

    const newSchool = new School({
      id: school.id,
      name: updateSchoolDto.name ?? school.name,
      promotions: school.promotions,
    })

    return this.schoolsRepository.save(newSchool)
  }
}
