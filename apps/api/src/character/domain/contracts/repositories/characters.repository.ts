import { ClearableRepository } from '#shared/storage/clearable_repository'
import { Id } from '#shared/id/domain/models/id'
import { Character } from '#character/domain/models/character'

export abstract class ICharactersRepository implements ClearableRepository {
  abstract save(character: Character): Promise<Character>
  abstract getAllByUserId(userId: Id): Promise<Character[]>
  abstract getById(characterId: Id): Promise<Character | null>
  abstract deleteById(characterId: Id): Promise<void>
  abstract empty(): Promise<void>
}
