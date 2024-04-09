import { Character } from '../../models/character.js'
import { Id } from '../../../../shared/id/domain/models/id.js'
import { ClearableRepository } from '../../../../shared/clearable_repository.js'

export abstract class ICharactersRepository implements ClearableRepository {
  abstract save(character: Character): Promise<Character>
  abstract getAllByUserId(userId: Id): Promise<Character[]>
  abstract getById(characterId: Id): Promise<Character | null>
  abstract deleteById(characterId: Id): Promise<void>
  abstract empty(): Promise<void>
}
