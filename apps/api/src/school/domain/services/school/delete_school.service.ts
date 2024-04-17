import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { UnauthorizedException } from '#shared/domain/exceptions/unauthorized.exception'
import { User } from '#user/domain/models/user'

@inject()
export class DeleteSchoolService {
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
  }

  async execute(schoolId: Id, user: User): Promise<void> {
    await this.validate(schoolId, user)

    await this.schoolsRepository.deleteById(schoolId)
  }
}
