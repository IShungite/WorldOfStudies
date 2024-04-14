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
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'

test.group('Characters - update', (group) => {
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

  test('should return a 401 if the user is not authenticated', async ({ client }) => {
    const response = await client.patch('/characters/1')

    response.assertStatus(StatusCodes.UNAUTHORIZED)

    response.assertTextIncludes('Unauthorized access')
  })

  test('should return a 401 if the character does not belong to the user', async ({ client }) => {
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()

    const [user, user2] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      usersRepository.save(new UserBuilderTest().build()),
      schoolsRepository.save(school),
    ])

    const character = new Character({
      name: 'Character 1',
      userId: user2.id,
      promotionId: school.promotions[0].id,
    })

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
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const [user] = await Promise.all([
      usersRepository.save(new UserBuilderTest().withId('1').build()),
      schoolsRepository.save(school),
    ])
    const character = new Character({
      name: 'Character 1',
      userId: new Id('2'),
      promotionId: school.promotions[0].id,
    })

    const response = await client
      .patch(`/characters/${character.id}`)
      .json({
        name: 1554,
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should update the name of the character', async ({ client }) => {
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const [user] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      schoolsRepository.save(school),
    ])
    const character = new Character({
      name: 'Character 1',
      userId: user.id,
      promotionId: school.promotions[0].id,
    })

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
