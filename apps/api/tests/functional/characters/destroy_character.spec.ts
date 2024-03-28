import { ICharactersRepository } from '#domain/ports/out/characters.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { Character } from '#domain/models/character/character'
import { IUsersRepository } from '#domain/ports/out/users.repository'
import { UserBuilderTest } from '#tests/builders/user_builder_test'

test.group('Characters - delete', (group) => {
  let charactersRepository: ICharactersRepository
  let usersRepository: IUsersRepository

  group.setup(async () => {
    ;[charactersRepository, usersRepository] = await Promise.all([
      app.container.make(ICharactersRepository),
      app.container.make(IUsersRepository),
    ])
  })

  group.each.setup(async () => {
    await Promise.all([charactersRepository.empty(), usersRepository])
  })

  test('It should return a 404 if one or more params are not a number', async ({ client }) => {
    const response = await client.delete('/characters/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return a 400 if the character does not exist', async ({ client }) => {
    const response = await client.delete('/characters/1')

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should delete the character', async ({ client, assert }) => {
    const user = new UserBuilderTest().build()

    await usersRepository.save(user)

    const character = new Character({ name: 'Character 1', userId: user.id })
    await charactersRepository.save(character)

    const response = await client.delete(`/characters/${character.id.toString()}`)
    const deletedCharacter = await charactersRepository.getById(character.id)

    response.assertStatus(StatusCodes.NO_CONTENT)
    assert.isNull(deletedCharacter)
  })
})
