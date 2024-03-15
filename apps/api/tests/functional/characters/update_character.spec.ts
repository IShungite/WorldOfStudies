import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { InMemoryCharactersRepository } from '#repositories/character/in_memory_characters.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { Character } from '#domainModels/character/character'
import { Id } from '#domainModels/id/id'

test.group('Characters - update', (group) => {
  let charactersRepository: ICharactersRepository

  group.each.setup(async () => {
    charactersRepository = new InMemoryCharactersRepository()
    app.container.swap(ICharactersRepository, () => {
      return charactersRepository
    })
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
    const character = new Character({ name: 'Character 1', userId: new Id('1') })
    await charactersRepository.save(character)

    const response = await client.patch(`/characters/${character.id}`).json({
      name: 'Character 2',
    })

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ name: 'Character 2' })
  })
})
