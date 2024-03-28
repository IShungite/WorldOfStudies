import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { School } from '#domainModels/school/school'

test.group('Schools - destroy', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    schoolsRepository = await app.container.make(ISchoolsRepository)
  })

  group.each.setup(async () => {
    await schoolsRepository.empty()
  })

  test('It should return a 400 if the school does not exist', async ({ client }) => {
    const response = await client.delete('/schools/1')

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should destroy the school', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    await schoolsRepository.save(school)

    const response = await client.delete(`/schools/${school.id}`)

    response.assertStatus(StatusCodes.NO_CONTENT)
  })
})
