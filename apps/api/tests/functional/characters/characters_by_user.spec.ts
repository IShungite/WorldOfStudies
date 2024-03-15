import { Character } from '#domainModels/character/character'
import { Id } from '#domainModels/id/id'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { InMemoryCharactersRepository } from '#repositories/character/in_memory_characters.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Characters - characters by user', (group) => {
  let charactersRepository: ICharactersRepository

  group.each.setup(async () => {
    charactersRepository = new InMemoryCharactersRepository()
    app.container.swap(ICharactersRepository, () => {
      return charactersRepository
    })
  })

  test('It should return an empty array if the user has no characters', async ({ client }) => {
    const userId = '1'

    const response = await client.get(`/characters/user/${userId}`)
    response.assertStatus(StatusCodes.OK)
    response.assertBody([])
  })

  test('It should return the list of characters by user id', async ({ client, assert }) => {
    const userId = '1'

    await Promise.all([
      charactersRepository.save(new Character({ name: 'Shun', userId: new Id(userId) })),
      charactersRepository.save(new Character({ name: 'Shun2', userId: new Id(userId) })),
      charactersRepository.save(new Character({ name: 'Bou', userId: new Id('2') })),
    ])

    const response = await client.get(`/characters/user/${userId}`)
    response.assertStatus(StatusCodes.OK)
    assert.lengthOf(response.body(), 2)
  })
})
