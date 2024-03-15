import { Character } from '#domainModels/character'
import { Id } from '#domainModels/id/id'

export abstract class ICharactersRepository {
  abstract save(character: Character): Promise<Character>
  abstract getAllByUserId(userId: Id): Promise<Character[]>
}
