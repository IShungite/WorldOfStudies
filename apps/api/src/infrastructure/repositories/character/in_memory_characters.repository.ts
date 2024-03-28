import { Character } from '#domain/models/character/character'
import { Id } from '#domain/models/id/id'
import { ICharactersRepository } from '#domain/contracts/repositories/characters.repository'

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
    return this.characters[characterId.toString()] ?? null
  }

  async deleteById(characterId: Id): Promise<void> {
    delete this.characters[characterId.toString()]
  }

  async empty(): Promise<void> {
    this.characters = {}
  }
}
