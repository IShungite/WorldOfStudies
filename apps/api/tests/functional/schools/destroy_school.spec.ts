import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { School } from '#school/domain/models/school'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import { role } from '#user/domain/models/role'

test.group('Schools - destroy', (group) => {
  let schoolsRepository: ISchoolsRepository
  let usersRepository: IUsersRepository

  group.setup(async () => {
    ;[schoolsRepository, usersRepository] = await createRepositories([
      ISchoolsRepository,
      IUsersRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository, usersRepository])
  })

  test('It should return a 401 if the user is not logged in', async ({ client }) => {
    const response = await client.delete('/schools/1')

    response.assertStatus(StatusCodes.UNAUTHORIZED)
  })

  test('It should return a 401 if the user is not an admin of the school', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().withRole(role.ADMIN).build())

    const school = new School({ name: 'School 1', admins: [] })
    await schoolsRepository.save(school)

    const response = await client.delete(`/schools/${school.id}`).loginWith(user)

    response.assertStatus(StatusCodes.UNAUTHORIZED)
  })

  test('It should destroy the school', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().withRole(role.ADMIN).build())

    const school = new School({ name: 'School 1', admins: [user] })
    await schoolsRepository.save(school)

    const response = await client.delete(`/schools/${school.id}`).loginWith(user)

    response.assertStatus(StatusCodes.NO_CONTENT)
  })
})
