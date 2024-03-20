import { Id } from '#domainModels/id/id'
import { Promotion } from '#domainModels/school/promotion'
import { School } from '#domainModels/school/school'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Subjects - store', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await Promise.all([app.container.make(ISchoolsRepository)])
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
