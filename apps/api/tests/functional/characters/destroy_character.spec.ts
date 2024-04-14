import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { UnauthorizedException } from '#shared/domain/exceptions/unauthorized.exception'
import { Character } from '#character/domain/models/character'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'

test.group('Characters - delete', (group) => {
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

    const response = await client.delete(`/characters/${character.id.toString()}`).loginWith(user)
    const deletedCharacter = await charactersRepository.getById(character.id)

    response.assertStatus(StatusCodes.NO_CONTENT)
    assert.isNull(deletedCharacter)
  })

  test('It should return a 401 if the user does not own the character', async ({ client }) => {
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()

    const [user, user2] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      usersRepository.save(new UserBuilderTest().build()),
      schoolsRepository.save(school),
    ])

    const character = new Character({
      name: 'Character 1',
      userId: user.id,
      promotionId: school.promotions[0].id,
    })
    await charactersRepository.save(character)

    const response = await client.delete(`/characters/${character.id.toString()}`).loginWith(user2)

    response.assertStatus(StatusCodes.UNAUTHORIZED)
    response.assertTextIncludes(new UnauthorizedException().message)
  })
})
