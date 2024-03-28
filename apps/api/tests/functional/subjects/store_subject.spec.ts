import { Id } from '#domain/models/id/id'
import { Promotion } from '#domain/models/school/promotion'
import { School } from '#domain/models/school/school'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Subjects - store', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await Promise.all([app.container.make(ISchoolsRepository)])
  })

  group.each.setup(async () => {
    await Promise.all([schoolsRepository.empty()])
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const response = await client.post('/subjects').json({})

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should create a subject', async ({ client }) => {
    await schoolsRepository.save(
      new School({
        id: new Id('1'),
        name: 'School 1',
        promotions: [new Promotion({ id: new Id('1'), name: 'Promotion 1', year: 2022 })],
      })
    )

    const response = await client.post('/subjects').json({
      name: 'Subject 1',
      promotionId: '1',
    })

    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ name: 'Subject 1' })
  })
})
