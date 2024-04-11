import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import emptyRepositories from '#tests/utils/empty_repositories'
import createRepositories from '#tests/utils/create_repositories'
import { LoginUserValidator } from '#user/infrastructure/validators/login_user.validator'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { role } from '#user/domain/models/role'
import { User } from '#user/domain/models/user'

test.group('Auth - login', (group) => {
  let usersRepository: IUsersRepository

  group.setup(async () => {
    ;[usersRepository] = await createRepositories([IUsersRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([usersRepository])
  })

  test('It should return a 401 if the credentials are invalid', async ({ client }) => {
    const payload: LoginUserValidator = {
      email: 'shun@example.com',
      password: '123456',
    }

    const response = await client.post('/auth/login').json(payload)
    response.assertStatus(StatusCodes.UNAUTHORIZED)
  })

  test('It should return a 409 if the payload is invalid', async ({ client }) => {
    const payload: LoginUserValidator = {
      email: 'shun@example.com',
    } as LoginUserValidator

    const response = await client.post('/auth/login').json(payload)
    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should login a user', async ({ client, assert }) => {
    const payload: LoginUserValidator = {
      email: 'shun@example.com',
      password: '123456',
    }

    await usersRepository.save(
      new User({
        email: payload.email,
        firstName: 'a',
        lastName: 'a',
        password: payload.password,
        role: role.STUDENT,
      })
    )

    const response = await client.post('/auth/login').json(payload)
    response.assertStatus(StatusCodes.OK)

    assert.containsSubset(response.body(), {
      token: String,
      type: 'auth_token',
      role: role.STUDENT,
    })
  })
})
