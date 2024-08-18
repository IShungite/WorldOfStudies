import { UserBuilderTest } from '#tests/builders/user_builder_test'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'
import { PromotionNotFoundException } from '#school/domain/models/promotion_not_found.exception'
import { Id } from '#shared/id/domain/models/id'
import { IInventoriesRepository } from '#inventory/domain/contracts/repositories/inventories.repository'

test.group('Characters - store', (group) => {
  let charactersRepository: ICharactersRepository
  let usersRepository: IUsersRepository
  let schoolsRepository: ISchoolsRepository
  let inventorysRepository: IInventoriesRepository

  group.setup(async () => {
    ;[charactersRepository, usersRepository, schoolsRepository, inventorysRepository] =
      await createRepositories([
        ICharactersRepository,
        IUsersRepository,
        ISchoolsRepository,
        IInventoriesRepository,
      ])
  })

  group.each.setup(async () => {
    await emptyRepositories([charactersRepository, usersRepository, schoolsRepository])
  })

  test('It should create a character', async ({ client }) => {
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()

    const [user] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      schoolsRepository.save(school),
    ])

    const response = await client
      .post('/characters')
      .json({
        name: 'Shun',
        promotionId: school.promotions[0].id.toString(),
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ result: { name: 'Shun', userId: user.id.toString() } })
  })

  test('It should return a 401 if the user is not authenticated', async ({ client }) => {
    const response = await client.post('/characters')

    response.assertStatus(StatusCodes.UNAUTHORIZED)
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const response = await client.post('/characters').json({}).loginWith(user)

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should return a 400 if the promotion does not exist', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())
    const promotionId = new Id('1')

    const response = await client
      .post('/characters')
      .json({
        name: 'Shun',
        promotionId: promotionId.toString(),
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new PromotionNotFoundException(promotionId).message)
  })

  test('It should create an empty inventory for the character', async ({ client, assert }) => {
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()

    const [user] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      schoolsRepository.save(school),
    ])

    const res = await client
      .post('/characters')
      .json({
        name: 'Shun',
        promotionId: school.promotions[0].id.toString(),
      })
      .loginWith(user)

    const character = res.body().result

    const inventory = await inventorysRepository.getByCharacterId(new Id(character.id))

    assert.isNotNull(inventory)
    assert.isEmpty(inventory!.items)
  })
})
