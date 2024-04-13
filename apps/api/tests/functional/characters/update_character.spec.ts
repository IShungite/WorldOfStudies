import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { UnauthorizedException } from '#shared/domain/exceptions/unauthorized.exception'
import { Character } from '#character/domain/models/character'
import { Id } from '#shared/id/domain/models/id'

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

  test('should return a 401 if the user is not authenticated', async ({ client }) => {
    const response = await client.patch('/characters/1')

    response.assertStatus(StatusCodes.UNAUTHORIZED)

    response.assertTextIncludes('Unauthorized access')
  })

  test('should return a 401 if the character does not belong to the user', async ({ client }) => {
    const [user, user2] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      usersRepository.save(new UserBuilderTest().build()),
    ])

    const character = new Character({ name: 'Character 1', userId: user2.id })

    await charactersRepository.save(character)

    const response = await client
      .patch(`/characters/${character.id.toString()}`)
      .json({
        name: 'Character 2',
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.UNAUTHORIZED)
    response.assertTextIncludes(new UnauthorizedException().message)
  })

  test('It should return a 400 if the character does not exist', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const response = await client
      .patch('/characters/1')
      .json({
        name: 'Character 1',
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const character = new Character({ name: 'Character 1', userId: new Id('1') })
    const response = await client
      .patch(`/characters/${character.id}`)
      .json({
        name: 1554,
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should update the name of the character', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const character = new Character({ name: 'Character 1', userId: user.id })
    await charactersRepository.save(character)

    const response = await client
      .patch(`/characters/${character.id}`)
      .json({
        name: 'Character 2',
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ result: { name: 'Character 2' } })
  })
})
