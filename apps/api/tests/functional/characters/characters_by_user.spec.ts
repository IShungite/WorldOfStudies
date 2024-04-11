import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Character } from '#character/domain/models/character'

test.group('Characters - characters by user', (group) => {
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

  test('It should return 401 when user is not authenticated', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const response = await client.get(`/users/${user.id.toString()}/characters`)

    response.assertStatus(StatusCodes.UNAUTHORIZED)
    response.assertTextIncludes('Unauthorized access')
  })

  test('It should return an empty array if the user has no characters', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const response = await client.get(`/users/${user.id.toString()}/characters`).loginWith(user)
    response.assertStatus(StatusCodes.OK)
    response.assertBody([])
  })

  test('It should return the list of characters by user id', async ({ client, assert }) => {
    const [user, user2] = await Promise.all([
      new UserBuilderTest().build(),
      new UserBuilderTest().build(),
    ])

    await Promise.all([usersRepository.save(user), usersRepository.save(user2)])

    await Promise.all([
      charactersRepository.save(new Character({ name: 'Shun', userId: user.id })),
      charactersRepository.save(new Character({ name: 'Shun2', userId: user.id })),
      charactersRepository.save(new Character({ name: 'Bou', userId: user2.id })),
    ])

    const response = await client.get(`/users/${user.id.toString()}/characters`).loginWith(user)

    response.assertStatus(StatusCodes.OK)
    assert.lengthOf(response.body(), 2)
  })
})
