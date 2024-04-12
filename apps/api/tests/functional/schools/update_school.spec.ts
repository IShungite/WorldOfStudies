import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import emptyRepositories from '#tests/utils/empty_repositories'
import createRepositories from '#tests/utils/create_repositories'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { School } from '#school/domain/models/school'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import { role } from '#user/domain/models/role'

test.group('Schools - update', (group) => {
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

  test('It should return a 400 if the school does not exist', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().withRole(role.ADMIN).build())

    const response = await client
      .patch('/schools/1')
      .json({
        name: 'School 1',
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().withRole(role.ADMIN).build())

    const school = new School({ name: 'School 1', admins: [user] })

    await schoolsRepository.save(school)

    const response = await client.patch(`/schools/${school.id}`).json({
      name: {},
    })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should return a 401 when the user is not allowed to update the school', async ({
    client,
  }) => {
    const user = await usersRepository.save(new UserBuilderTest().withRole(role.ADMIN).build())

    const school = new School({ name: 'School 1', admins: [] })

    await schoolsRepository.save(school)

    const response = await client
      .patch(`/schools/${school.id}`)
      .json({
        name: 'School 2',
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.UNAUTHORIZED)
  })

  test('It should update the name of the school', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().withRole(role.ADMIN).build())

    const school = new School({ name: 'School 1', admins: [user] })
    await schoolsRepository.save(school)

    const response = await client
      .patch(`/schools/${school.id}`)
      .json({
        name: 'School 2',
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ name: 'School 2' })
  })
})
