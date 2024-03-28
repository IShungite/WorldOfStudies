import { ICharactersRepository } from '#domain/ports/out/characters.repository'
import { IUsersRepository } from '#domain/ports/out/users.repository'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Characters - store', (group) => {
  let charactersRepository: ICharactersRepository
  let usersRepository: IUsersRepository

  group.setup(async () => {
    ;[charactersRepository, usersRepository] = await Promise.all([
      app.container.make(ICharactersRepository),
      app.container.make(IUsersRepository),
    ])
  })

  group.each.setup(async () => {
    await Promise.all([charactersRepository.empty(), usersRepository.empty()])
  })

  test('It should create a character', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())
    const token = await usersRepository.createToken(user)

    const response = await client
      .post('/characters')
      .json({
        name: 'Shun',
      })
      .headers({
        Authorization: `Bearer ${token.token}`,
      })

    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ name: 'Shun', userId: user.id.toString() })
  })

  test('It should return a 401 if the user is not authenticated', async ({ client }) => {
    const response = await client.post('/characters')

    response.assertStatus(StatusCodes.UNAUTHORIZED)
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())
    const token = await usersRepository.createToken(user)

    const response = await client
      .post('/characters')
      .json({})
      .headers({
        Authorization: `Bearer ${token.token}`,
      })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })
})
