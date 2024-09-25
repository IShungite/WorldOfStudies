import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Id } from '#shared/id/domain/models/id'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { User } from '#user/domain/models/user'
import app from '@adonisjs/core/services/app'

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IUsersRepository)

    const users: User[] = [
      new User({
        id: new Id('1'),
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@admin.com',
        role: 'admin',
        password: 'admin',
      }),
      new User({
        id: new Id('2'),
        firstName: 'Jean',
        lastName: 'Aff',
        email: 'pres@pres.fr',
        role: 'student',
        password: 'pres',
      }),
      new User({
        id: new Id('3'),
        firstName: 'student 2',
        lastName: 'student 2',
        email: 'student2@student2.com',
        role: 'student',
        password: 'student2',
      }),
      new User({
        id: new Id('4'),
        firstName: 'student 3',
        lastName: 'student 3',
        email: 'student3@student3.com',
        role: 'student',
        password: 'student3',
      }),
      new User({
        id: new Id('5'),
        firstName: 'student 4',
        lastName: 'student 4',
        email: 'student4@student4.com',
        role: 'student',
        password: 'student4',
      }),
      new User({
        id: new Id('6'),
        firstName: 'teacher 1',
        lastName: 'teacher 1',
        email: 'teacher1@teacher1.com',
        role: 'teacher',
        password: 'teacher1',
      }),
      new User({
        id: new Id('7'),
        firstName: 'teacher 2',
        lastName: 'teacher 2',
        email: 'teacher2@teacher2.com',
        role: 'teacher',
        password: 'teacher2',
      }),
    ]
    await Promise.all(users.map((user) => repo.save(user)))
  }
}
