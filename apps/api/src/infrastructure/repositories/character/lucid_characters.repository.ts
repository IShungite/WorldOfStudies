import { Character } from '#domain/models/character/character'
import { Id } from '#domain/models/id/id'
import { ICharactersRepository } from '#domain/ports/out/characters.repository'
import CharacterEntity from '#infrastructure/models/character'
import { CharacterMapper } from '#infrastructure/mappers/character.mapper'
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
    const characters = await CharacterEntity.query().where('userId', userId.toString())

    return characters.map((character) => CharacterMapper.fromLucid(character))
  }

  async getById(characterId: Id): Promise<Character | null> {
    const character = await CharacterEntity.find(characterId.toString())
    return character ? CharacterMapper.fromLucid(character) : null
  }

  async deleteById(characterId: Id): Promise<void> {
    await CharacterEntity.query().where('id', characterId.toString()).delete()
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
