import { Character } from '#domainModels/character/character'
import { Id } from '#domainModels/id/id'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'

export class InMemoryCharactersRepository implements ICharactersRepository {
  private characters: Record<string, Character> = {}

  async save(character: Character): Promise<Character> {
    this.characters[character.id.toString()] = character
    return character
  }

  async getAllByUserId(userId: Id): Promise<Character[]> {
    return Object.values(this.characters).filter((character) => character.userId.equals(userId))
  }

  async getById(characterId: Id): Promise<Character | null> {
    return (
      Object.values(this.characters).find((character) => character.id.equals(characterId)) ?? null
    )
  }
}
