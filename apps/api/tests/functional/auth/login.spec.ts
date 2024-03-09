import { role } from '#domainModels/user/role'
import { CreateUserDto, User } from '#domainModels/user/user'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { UserMapper } from '#mappers/user.mapper'
import { InMemoryUsersRepository } from '#repositories/user/in_memory_users.repository'
import { LoginUserValidator } from '#validators/login_user.validator'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Auth - login', (group) => {
  let usersRepository: IUsersRepository

  group.each.setup(async () => {
    usersRepository = new InMemoryUsersRepository()
    app.container.swap(IUsersRepository, () => {
      return usersRepository
    })
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

    usersRepository.save(
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
