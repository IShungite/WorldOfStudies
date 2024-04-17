import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { School, UpdateSchoolDto } from '#school/domain/models/school'
import { User } from '#user/domain/models/user'
import { UnauthorizedException } from '#shared/domain/exceptions/unauthorized.exception'

@inject()
export class UpdateSchoolService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  private async validate(schoolId: Id, user: User) {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException(schoolId)
    }

    const admins = await this.schoolsRepository.getAdmins(schoolId)

    if (!admins.find((admin) => admin.id.equals(user.id))) {
      throw new UnauthorizedException()
    }

    return school
  }

  async execute(schoolId: Id, user: User, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const school = await this.validate(schoolId, user)

    const newSchool = new School({
      id: school.id,
      name: updateSchoolDto.name ?? school.name,
      promotions: school.promotions,
    })

    return this.schoolsRepository.save(newSchool)
  }
}
