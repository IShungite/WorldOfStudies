import { Id } from '#domainModels/id'
import { School } from '#domainModels/school'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { InMemorySchoolsRepository } from '#repositories/in_memory_schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

test.group('Promotions', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.each.setup(async () => {
    schoolsRepository = new InMemorySchoolsRepository()
    app.container.swap(ISchoolsRepository, () => {
      return schoolsRepository
    })
  })

  test('It should create a promotion', async ({ client }) => {
    schoolsRepository.save(new School({ id: new Id('1'), name: 'School 1' }))

    const response = await client.post('/promotions').json({
      name: 'Promotion 1',
      year: 2022,
      schoolId: '1',
    })
    response.assertStatus(201)
    response.assertBodyContains({ name: 'Promotion 1' })
  })
})
