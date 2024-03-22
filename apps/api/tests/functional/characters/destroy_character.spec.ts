import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { Character } from '#domainModels/character/character'
import { Id } from '#domainModels/id/id'

test.group('Characters - delete', (group) => {
  let charactersRepository: ICharactersRepository

  group.setup(async () => {
    ;[charactersRepository] = await Promise.all([app.container.make(ICharactersRepository)])
  })

  group.each.setup(async () => {
    await Promise.all([charactersRepository.empty()])
  })

  test('It should return a 404 if one or more params are not a number', async ({ client }) => {
    const response = await client.delete('/characters/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return a 400 if the character does not exist', async ({ client }) => {
    const response = await client.delete('/characters/1')

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should delete the character', async ({ client, assert }) => {
    const character = new Character({ name: 'Character 1', userId: new Id('1') })
    await charactersRepository.save(character)

    const response = await client.delete(`/characters/${character.id.toString()}`)
    const deletedCharacter = await charactersRepository.getById(character.id)

    response.assertStatus(StatusCodes.NO_CONTENT)
    assert.isNull(deletedCharacter)
  })
})