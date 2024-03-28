import { ISchoolsRepository } from '#domain/ports/out/schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Schools - store', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    schoolsRepository = await app.container.make(ISchoolsRepository)
  })

  group.each.setup(async () => {
    await schoolsRepository.empty()
  })

  test('It should create a school', async ({ client }) => {
    const response = await client.post('/schools').json({
      name: 'School 1',
    })

    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ name: 'School 1' })
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const response = await client.post('/schools').json({
      name: '',
    })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })
})
