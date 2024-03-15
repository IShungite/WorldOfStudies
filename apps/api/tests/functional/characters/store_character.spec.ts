import { Character } from '#domainModels/character'
import { Id } from '#domainModels/id/id'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { InMemoryCharactersRepository } from '#repositories/character/in_memory_characters.repository'
import { InMemoryUsersRepository } from '#repositories/user/in_memory_users.repository'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Characters - store', (group) => {
  let charactersRepository: ICharactersRepository
  let usersRepository: IUsersRepository

  group.each.setup(async () => {
    charactersRepository = new InMemoryCharactersRepository()
    app.container.swap(ICharactersRepository, () => {
      return charactersRepository
    })
    usersRepository = new InMemoryUsersRepository()
    app.container.swap(IUsersRepository, () => {
      return usersRepository
    })
  })

  test('It should create a character', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const response = await client
      .post('/characters')
      .json({
        name: 'Shun',
      })
      .loginAs(user as any)
    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ name: 'Shun', userId: user.id.toString() })
  })

  test('It should return a 401 if the user is not authenticated', async ({ client }) => {
    const response = await client.post('/characters')
    response.assertStatus(StatusCodes.UNAUTHORIZED)
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const response = await client
      .post('/characters')
      .json({})
      .loginAs(user as any)

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should return the list of characters by user id', async ({ client, assert }) => {
    await Promise.all([
      charactersRepository.save(new Character({ name: 'Shun', userId: new Id('1') })),
      charactersRepository.save(new Character({ name: 'Bou', userId: new Id('2') })),
    ])

    const response = await client.get('/characters/user/1')
    response.assertStatus(StatusCodes.OK)
    assert.lengthOf(response.body(), 1)
  })
})
