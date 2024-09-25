import { subjects } from '#database/seeders/1_subject_seeder'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Promotion } from '#school/domain/models/promotion'
import { School } from '#school/domain/models/school'
import { Id } from '#shared/id/domain/models/id'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(ISchoolsRepository)
    const userRepo = await app.container.make(IUsersRepository)

    const admin = await userRepo.getByEmail('admin@admin.com')

    const schools: School[] = [
      new School({
        id: new Id('1'),
        name: 'Ynov',
        admins: [admin!],
        promotions: [
          new Promotion({
            id: new Id('1'),
            name: 'B1 Info',
            year: 2022,
            subjects: [subjects[0], subjects[1], subjects[2]],
          }),
          new Promotion({
            id: new Id('2'),
            name: 'B2 Info',
            year: 2022,
            subjects: [subjects[3], subjects[4], subjects[5]],
          }),
        ],
      }),
      new School({
        id: new Id('2'),
        name: 'School 2',
        promotions: [
          new Promotion({
            id: new Id('3'),
            name: 'Promotion 2-1',
            year: 2022,
            subjects: [subjects[5], subjects[1]],
          }),
          new Promotion({
            id: new Id('4'),
            name: 'Promotion 2-2',
            year: 2022,
            subjects: [subjects[2], subjects[3], subjects[4]],
          }),
        ],
      }),
    ]
    await Promise.all(schools.map((school) => repo.save(school)))
  }
}
