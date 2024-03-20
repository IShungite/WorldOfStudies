import { Character } from '#domainModels/character/character'
import { Id } from '#domainModels/id/id'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import CharacterEntity from '#models/character'
import { CharacterMapper } from '#mappers/character.mapper'
import testUtils from '@adonisjs/core/services/test_utils'

export class LucidCharactersRepository implements ICharactersRepository {
  async save(character: Character): Promise<Character> {
    const newCharacter = await CharacterEntity.updateOrCreate(
      { id: Number.parseInt(character.id.toString(), 10) },
      {
        name: character.name,
        userId: Number.parseInt(character.userId.toString(), 10),
      }
    )

    return CharacterMapper.fromLucid(newCharacter)
  }

  async getAllByUserId(userId: Id): Promise<Character[]> {
    const characters = (await CharacterEntity.findManyBy(
      'userId',
      userId.toString()
    )) as CharacterEntity[]

    return characters.map((character) => CharacterMapper.fromLucid(character))
  }

  async getById(characterId: Id): Promise<Character | null> {
    const character = await CharacterEntity.find(characterId.toString())
    return character ? CharacterMapper.fromLucid(character) : null
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
