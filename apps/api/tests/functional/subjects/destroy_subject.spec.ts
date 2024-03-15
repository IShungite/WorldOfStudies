import { Id } from '#domainModels/id/id'
import { Promotion } from '#domainModels/school/promotion'
import { School } from '#domainModels/school/school'
import { Subject } from '#domainModels/school/subject'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { InMemorySchoolsRepository } from '#repositories/in_memory_schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Subjects - destroy', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.each.setup(async () => {
    schoolsRepository = new InMemorySchoolsRepository()
    app.container.swap(ISchoolsRepository, () => {
      return schoolsRepository
    })
  })

  test('It should return a 404 if the payload is invalid', async ({ client }) => {
    const response = await client.delete('/school/1/promotion/1/subject/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return an exception if the school does not exist', async ({ client }) => {
    const response = await client.delete('/school/1/promotion/1/subject/1')

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes('School with id 1 not found')
  })

  test('It should return an exception if the promotion does not exist', async ({ client }) => {
    await schoolsRepository.save(
      new School({
        id: new Id('1'),
        name: 'School 1',
        promotions: [],
      })
    )

    const response = await client.delete('/school/1/promotion/1/subject/1')

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes('Promotion with id 1 not found')
  })

  test('It should return an exception if the subject does not exist', async ({ client }) => {
    await schoolsRepository.save(
      new School({
        id: new Id('1'),
        name: 'School 1',
        promotions: [new Promotion({ id: new Id('1'), name: 'Promotion 1', year: 2022 })],
      })
    )

    const response = await client.delete('/school/1/promotion/1/subject/1')

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes('Subject with id 1 not found')
  })

  test('It should destroy a subject', async ({ client }) => {
    await schoolsRepository.save(
      new School({
        id: new Id('1'),
        name: 'School 1',
        promotions: [
          new Promotion({
            id: new Id('1'),
            name: 'Promotion 1',
            year: 2022,
            subjects: [new Subject({ id: new Id('1'), name: 'Subject 1' })],
          }),
        ],
      })
    )

    const response = await client.delete('/school/1/promotion/1/subject/1')

    response.assertStatus(StatusCodes.OK)
  })
})
