import { role } from '#domainModels/user/role'
import { CreateUserDto, User } from '#domainModels/user/user'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { InMemoryUsersRepository } from '#repositories/user/in_memory_users.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Auth', (group) => {
  let usersRepository: IUsersRepository

  group.each.setup(async () => {
    usersRepository = new InMemoryUsersRepository()
    app.container.swap(IUsersRepository, () => {
      return usersRepository
    })
  })

  test('It should register a user', async ({ client }) => {
    const payload: CreateUserDto = {
      email: 'shun@example.com',
      firstName: 'Shun',
      lastName: 'Bou',
      password: '123456',
    }

    const response = await client.post('/auth/register').json(payload)
    response.assertStatus(201)
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
    response.assertStatus(201)
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

    usersRepository.save(
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
