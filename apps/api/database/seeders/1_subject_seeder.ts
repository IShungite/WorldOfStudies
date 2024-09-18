import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { Subject } from '#school/domain/models/subject'
import { Id } from '#shared/id/domain/models/id'
import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export const subjects = [
  new Subject({ id: new Id('1'), name: 'Maths' }),
  new Subject({ id: new Id('2'), name: 'Science' }),
  new Subject({ id: new Id('3'), name: 'History' }),
  new Subject({ id: new Id('4'), name: 'Geography' }),
  new Subject({ id: new Id('5'), name: 'English' }),
  new Subject({ id: new Id('6'), name: 'French' }),
  new Subject({ id: new Id('7'), name: 'German' }),
  new Subject({ id: new Id('8'), name: 'Spanish' }),
]

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(ISubjectsRepository)

    await Promise.all(subjects.map((subject) => repo.save(subject)))
  }
}
