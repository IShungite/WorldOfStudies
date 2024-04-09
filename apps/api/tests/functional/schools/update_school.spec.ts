import { ISchoolsRepository } from '../../../src/school/domain/contracts/repositories/schools.repository.js'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { School } from '../../../src/school/domain/models/school.js'
import emptyRepositories from '#tests/utils/empty_repositories'
import createRepositories from '#tests/utils/create_repositories'

test.group('Schools - update', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await createRepositories([ISchoolsRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository])
  })

  test('It should return a 400 if the school does not exist', async ({ client }) => {
    const response = await client.patch('/schools/1').json({
      name: 'School 1',
    })

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const response = await client.patch(`/schools/${school.id}`).json({
      name: {},
    })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should update the name of the school', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    await schoolsRepository.save(school)

    const response = await client.patch(`/schools/${school.id}`).json({
      name: 'School 2',
    })

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ name: 'School 2' })
  })
})
