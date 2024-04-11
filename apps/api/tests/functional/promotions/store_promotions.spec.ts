import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { School } from '#school/domain/models/school'
import { Id } from '#shared/id/domain/models/id'

test.group('Promotions - store', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await createRepositories([ISchoolsRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository])
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
