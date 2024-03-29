import { ICharactersRepository } from '#domain/contracts/repositories/characters.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { Character } from '#domain/models/character/character'
import { Id } from '#domain/models/id/id'
import { IUsersRepository } from '#domain/contracts/repositories/users.repository'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'

test.group('Characters - update', (group) => {
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

  test('It should return a 400 if the character does not exist', async ({ client }) => {
    const response = await client.patch('/characters/1').json({
      name: 'Character 1',
    })

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const character = new Character({ name: 'Character 1', userId: new Id('1') })
    const response = await client.patch(`/characters/${character.id}`).json({
      name: 1554,
    })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should update the name of the character', async ({ client }) => {
    const user = new UserBuilderTest().build()
    await usersRepository.save(user)

    const character = new Character({ name: 'Character 1', userId: user.id })
    await charactersRepository.save(character)

    const response = await client.patch(`/characters/${character.id}`).json({
      name: 'Character 2',
    })

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ name: 'Character 2' })
  })
})
