import { Character } from '#domain/models/character/character'
import { ICharactersRepository } from '#domain/ports/out/characters.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import { IUsersRepository } from '#domain/ports/out/users.repository'

test.group('Characters - characters by user', (group) => {
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

  test('It should return an empty array if the user has no characters', async ({ client }) => {
    const userId = '1'

    const response = await client.get(`/users/${userId}/characters`)
    response.assertStatus(StatusCodes.OK)
    response.assertBody([])
  })

  test('It should return the list of characters by user id', async ({ client, assert }) => {
    const user = new UserBuilderTest().build()
    const user2 = new UserBuilderTest().withEmail('helo@mail.com').build()

    await Promise.all([usersRepository.save(user), usersRepository.save(user2)])

    await Promise.all([
      charactersRepository.save(new Character({ name: 'Shun', userId: user.id })),
      charactersRepository.save(new Character({ name: 'Shun2', userId: user.id })),
      charactersRepository.save(new Character({ name: 'Bou', userId: user2.id })),
    ])

    const response = await client.get(`/users/${user.id.toString()}/characters`)

    response.assertStatus(StatusCodes.OK)
    assert.lengthOf(response.body(), 2)
  })
})
