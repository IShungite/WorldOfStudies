import { Character } from '#domain/models/character/character'
import { Id } from '#domain/models/id/id'
import { ClearableRepository } from '#infrastructure/repositories/clearable_repository'

export abstract class ICharactersRepository implements ClearableRepository {
  abstract save(character: Character): Promise<Character>
  abstract getAllByUserId(userId: Id): Promise<Character[]>
  abstract getById(characterId: Id): Promise<Character | null>
  abstract deleteById(characterId: Id): Promise<void>
  abstract empty(): Promise<void>
}
