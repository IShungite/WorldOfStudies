import { Id } from '../../../src/shared/id/domain/models/id.js'
import { Promotion } from '../../../src/school/domain/models/promotion.js'
import { School } from '../../../src/school/domain/models/school.js'
import { ISchoolsRepository } from '../../../src/school/domain/contracts/repositories/schools.repository.js'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'

test.group('Subjects - store', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await createRepositories([ISchoolsRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository])
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
