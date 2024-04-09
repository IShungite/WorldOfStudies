import { ICharactersRepository } from '../../../src/character/domain/contracts/repositories/characters.repository.js'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { Character } from '../../../src/character/domain/models/character.js'
import { IUsersRepository } from '../../../src/user/domain/contracts/repositories/users.repository.js'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { UnauthorizedException } from '../../../src/shared/exceptions/unauthorized.exception'

test.group('Characters - delete', (group) => {
  let charactersRepository: ICharactersRepository
  let usersRepository: IUsersRepository

  group.setup(async () => {
    ;[charactersRepository, usersRepository] = await createRepositories([
      ICharactersRepository,
      IUsersRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([charactersRepository, usersRepository])
  })

  test('It should return a 404 if one or more params are not a number', async ({ client }) => {
    const response = await client.delete('/characters/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return a 400 if the character does not exist', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const response = await client.delete('/characters/1').loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should delete the character', async ({ client, assert }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const character = new Character({ name: 'Character 1', userId: user.id })
    await charactersRepository.save(character)

    const response = await client.delete(`/characters/${character.id.toString()}`).loginWith(user)
    const deletedCharacter = await charactersRepository.getById(character.id)

    response.assertStatus(StatusCodes.NO_CONTENT)
    assert.isNull(deletedCharacter)
  })

  test('It should return a 401 if the user does not own the character', async ({ client }) => {
    const [user, user2] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      usersRepository.save(new UserBuilderTest().build()),
    ])

    const character = new Character({ name: 'Character 1', userId: user.id })
    await charactersRepository.save(character)

    const response = await client.delete(`/characters/${character.id.toString()}`).loginWith(user2)

    response.assertStatus(StatusCodes.UNAUTHORIZED)
    response.assertTextIncludes(new UnauthorizedException().message)
  })
})
