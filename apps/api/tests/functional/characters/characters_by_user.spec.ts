import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Character } from '#character/domain/models/character'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'

test.group('Characters - characters by user', (group) => {
  let charactersRepository: ICharactersRepository
  let usersRepository: IUsersRepository
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[charactersRepository, usersRepository, schoolsRepository] = await createRepositories([
      ICharactersRepository,
      IUsersRepository,
      ISchoolsRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([charactersRepository, usersRepository, schoolsRepository])
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
    response.assertBody({ results: [] })
  })

  test('It should return the list of characters by user id', async ({ client, assert }) => {
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const [user, user2] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      usersRepository.save(new UserBuilderTest().build()),
      schoolsRepository.save(school),
    ])
    const promotionId = school.promotions[0].id
    await Promise.all([
      charactersRepository.save(new Character({ name: 'Shun', userId: user.id, promotionId })),
      charactersRepository.save(new Character({ name: 'Shun2', userId: user.id, promotionId })),
      charactersRepository.save(new Character({ name: 'Bou', userId: user2.id, promotionId })),
    ])

    const response = await client.get(`/users/${user.id.toString()}/characters`).loginWith(user)

    response.assertStatus(StatusCodes.OK)
    assert.lengthOf(response.body().results, 2)
  })
})
