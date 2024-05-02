import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { School } from '#school/domain/models/school'
import { Id } from '#shared/id/domain/models/id'
import app from '@adonisjs/core/services/app'
import { Promotion } from '#school/domain/models/promotion'
import { Subject } from '#school/domain/models/subject'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(ISchoolsRepository)
    const userRepo = await app.container.make(IUsersRepository)

    const admin = await userRepo.getByEmail('admin@admin.com')

    const schools: School[] = [
      new School({
        id: new Id('1'),
        name: 'School 1',
        admins: [admin!],
        promotions: [
          new Promotion({
            id: new Id('1'),
            name: 'Promotion 1-1',
            year: 2022,
            subjects: [
              new Subject({ id: new Id('1'), name: 'Subject 1-1-1' }),
              new Subject({ id: new Id('2'), name: 'Subject 1-1-2' }),
              new Subject({ id: new Id('3'), name: 'Subject 1-1-3' }),
            ],
          }),
          new Promotion({
            id: new Id('2'),
            name: 'Promotion 1-2',
            year: 2022,
            subjects: [
              new Subject({ id: new Id('4'), name: 'Subject 1-2-1' }),
              new Subject({ id: new Id('5'), name: 'Subject 1-2-2' }),
              new Subject({ id: new Id('6'), name: 'Subject 1-2-3' }),
            ],
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
            subjects: [
              new Subject({ id: new Id('7'), name: 'Subject 2-1-1' }),
              new Subject({ id: new Id('8'), name: 'Subject 2-1-2' }),
              new Subject({ id: new Id('9'), name: 'Subject 2-1-3' }),
            ],
          }),
          new Promotion({
            id: new Id('4'),
            name: 'Promotion 2-2',
            year: 2022,
            subjects: [
              new Subject({ id: new Id('10'), name: 'Subject 2-2-1' }),
              new Subject({ id: new Id('11'), name: 'Subject 2-2-2' }),
              new Subject({ id: new Id('12'), name: 'Subject 2-2-3' }),
            ],
          }),
        ],
      }),
    ]
    await Promise.all(schools.map((school) => repo.save(school)))
  }
}
