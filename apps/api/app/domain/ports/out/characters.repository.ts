import { Character } from '#domainModels/character'
import { Id } from '#domainModels/id'
import { School } from '#domainModels/school'

export abstract class ICharactersRepository {
  abstract create(character: Character): Promise<Character>
  abstract getAllByUserId(userId: Id): Promise<Character[]>
}
