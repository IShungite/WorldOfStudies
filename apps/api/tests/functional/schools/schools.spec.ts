import { Id } from '#domainModels/id/id'
import { School } from '#domainModels/school/school'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { InMemorySchoolsRepository } from '#repositories/in_memory_schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

test.group('Schools', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.each.setup(async () => {
    schoolsRepository = new InMemorySchoolsRepository()
    app.container.swap(ISchoolsRepository, () => {
      return schoolsRepository
    })
  })

  test('It should create a school', async ({ client }) => {
    const response = await client.post('/schools').json({
      name: 'School 1',
    })
    response.assertStatus(201)
    response.assertBodyContains({ name: 'School 1' })
  })

  test('It should return the school', async ({ client }) => {
    schoolsRepository.save(new School({ id: new Id('1'), name: 'School 1' }))

    const response = await client.get('/schools/1')
    response.assertStatus(200)
    response.assertBodyContains({ id: '1', name: 'School 1' })
  })
})
