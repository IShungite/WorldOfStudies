import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import emptyRepositories from '#tests/utils/empty_repositories'
import createRepositories from '#tests/utils/create_repositories'

test.group('Schools - store', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await createRepositories([ISchoolsRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository])
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
