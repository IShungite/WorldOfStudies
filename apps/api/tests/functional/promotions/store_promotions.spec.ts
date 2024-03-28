import { Id } from '#domainModels/id/id'
import { School } from '#domainModels/school/school'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Promotions - store', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    schoolsRepository = await app.container.make(ISchoolsRepository)
  })

  group.each.setup(async () => {
    await schoolsRepository.empty()
  })

  test('It should create a promotion', async ({ client }) => {
    await schoolsRepository.save(new School({ id: new Id('1'), name: 'School 1' }))

    const response = await client.post('/promotions').json({
      name: 'Promotion 1',
      year: 2022,
      schoolId: '1',
    })
    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ name: 'Promotion 1' })
  })

  test('It should return a 400 if the school does not exist', async ({ client }) => {
    const response = await client.post('/promotions').json({
      name: 'Promotion 1',
      year: 2022,
      schoolId: '1',
    })
    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const response = await client.post('/promotions').json({})

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })
})
