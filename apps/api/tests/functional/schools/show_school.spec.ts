import { Id } from '#domain/models/id/id'
import { School } from '#domain/models/school/school'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'

test.group('Schools - show', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await createRepositories([ISchoolsRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository])
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
