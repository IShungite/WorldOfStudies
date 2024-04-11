import testUtils from '@adonisjs/core/services/test_utils'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { CharacterMapper } from '#character/infrastructure/mappers/character.mapper'
import { Id } from '#shared/id/domain/models/id'
import { Character } from '#character/domain/models/character'
import CharacterEntity from '#character/infrastructure/entities/character'

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
