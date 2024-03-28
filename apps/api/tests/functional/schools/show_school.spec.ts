import { Id } from '#domain/models/id/id'
import { School } from '#domain/models/school/school'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Schools - show', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    schoolsRepository = await app.container.make(ISchoolsRepository)
  })

  group.each.setup(async () => {
    await schoolsRepository.empty()
  })

  test('It should return a 400 when school does not exist', async ({ client }) => {
    const response = await client.get('/schools/1')

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return the school', async ({ client }) => {
    await schoolsRepository.save(new School({ id: new Id('1'), name: 'School 1' }))

    const response = await client.get('/schools/1')

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ id: '1', name: 'School 1' })
  })
})
