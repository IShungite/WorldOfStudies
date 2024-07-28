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
import { CharacterResponse } from '@world-of-studies/api-types'

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
    const response = await client.get(`/me/characters`)

    response.assertStatus(StatusCodes.UNAUTHORIZED)
    response.assertTextIncludes('Unauthorized access')
  })

  test('It should return an empty array if the authenticated user has no characters', async ({
    client,
  }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const response = await client.get(`/me/characters`).loginWith(user)
    response.assertStatus(StatusCodes.OK)
    response.assertBody({ results: [] })
  })

  test('It should return the characters list of the authenticated user', async ({
    client,
    assert,
  }) => {
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const school2 = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const [user, user2] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      usersRepository.save(new UserBuilderTest().build()),
      schoolsRepository.save(school),
      schoolsRepository.save(school2),
    ])
    const promotionId = school.promotions[0].id
    const promotionId2 = school2.promotions[0].id

    const [character1, character2] = await Promise.all([
      charactersRepository.save(new Character({ name: 'Shun', userId: user.id, promotionId })),
      charactersRepository.save(
        new Character({ name: 'Shun2', userId: user.id, promotionId: promotionId2 })
      ),
      charactersRepository.save(new Character({ name: 'Bou', userId: user2.id, promotionId })),
    ])

    const response = await client.get(`/me/characters`).loginWith(user)

    response.assertStatus(StatusCodes.OK)
    const body = response.body()
    assert.lengthOf(body.results, 2)

    const character1Resp = body.results.find(
      (c: CharacterResponse & { schoolId: string }) => c.result.id === character1.id.toString()
    ).result
    const character2Resp = body.results.find(
      (c: CharacterResponse & { schoolId: string }) => c.result.id === character2.id.toString()
    ).result
    assert.equal(character1Resp.id, character1.id.toString())
    assert.equal(character2Resp.id, character2.id.toString())

    assert.equal(character1Resp.schoolId, school.id.toString())
    assert.equal(character2Resp.schoolId, school2.id.toString())
  })
})
