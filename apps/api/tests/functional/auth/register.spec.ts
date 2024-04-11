import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { CreateUserDto, User } from '#user/domain/models/user'
import { role } from '#user/domain/models/role'

test.group('Auth - register', (group) => {
  let usersRepository: IUsersRepository

  group.setup(async () => {
    ;[usersRepository] = await createRepositories([IUsersRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([usersRepository])
  })

  test('It should register a user', async ({ client }) => {
    const payload: CreateUserDto = {
      email: 'shun@example.com',
      firstName: 'Shun',
      lastName: 'Bou',
      password: '123456',
    }

    const response = await client.post('/auth/register').json(payload)
    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ ...payload, password: undefined })
  })

  test('It should register a user with the default role "STUDENT"', async ({ client }) => {
    const payload: CreateUserDto = {
      email: 'shun@example.com',
      firstName: 'Shun',
      lastName: 'Bou',
      password: '123456',
    }

    const response = await client.post('/auth/register').json(payload)
    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ role: role.STUDENT })
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const payload: CreateUserDto = {
      email: '',
      firstName: 'Shun',
      lastName: 'Bou',
      password: '123456',
    }

    const response = await client.post('/auth/register').json(payload)
    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should return a 409 if the user already exists', async ({ client }) => {
    const payload: CreateUserDto = {
      email: 'shun@example.com',
      firstName: 'Shun',
      lastName: 'Bou',
      password: '123456',
    }

    await usersRepository.save(
      new User({
        email: 'shun@example.com',
        firstName: 'a',
        lastName: 'a',
        password: 'a',
        role: role.STUDENT,
      })
    )

    const response = await client.post('/auth/register').json(payload)

    response.assertStatus(StatusCodes.CONFLICT)
  })
})
