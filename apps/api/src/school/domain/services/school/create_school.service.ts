import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { CreateSchoolDto, School } from '#school/domain/models/school'
import { User } from '#user/domain/models/user'
import { role } from '#user/domain/models/role'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'

@inject()
export class CreateSchoolService {
  constructor(
    private readonly schoolsRepository: ISchoolsRepository,
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute(createSchoolDto: CreateSchoolDto): Promise<School> {
    const templateAdmin = new User({
      firstName: 'admin',
      lastName: 'admin',
      role: role.ADMIN,
      email: '',
      password: 'password',
    })

    const admin = new User({
      ...templateAdmin,
      email: `${templateAdmin.id}@worldofstudies.com`,
    })

    await this.usersRepository.save(admin)

    const school = new School({ ...createSchoolDto, admins: [admin] })

    return this.schoolsRepository.save(school)
  }
}
