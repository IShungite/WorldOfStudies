import { ISchoolsRepository } from '../../../src/school/domain/contracts/repositories/schools.repository.js'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { School } from '../../../src/school/domain/models/school.js'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'

test.group('Schools - destroy', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await createRepositories([ISchoolsRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository])
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
