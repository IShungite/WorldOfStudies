import { Character } from '#domainModels/character/character'
import { Id } from '#domainModels/id/id'

export abstract class ICharactersRepository {
  abstract save(character: Character): Promise<Character>
  abstract getAllByUserId(userId: Id): Promise<Character[]>
  abstract getById(characterId: Id): Promise<Character | null>
  abstract deleteById(characterId: Id): Promise<void>
  abstract empty(): Promise<void>
}
