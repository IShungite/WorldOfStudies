import { Character } from '#domainModels/character'
import { Id } from '#domainModels/id'

export interface GetCharactersByUserIdUseCase {
  get: (userId: Id) => Promise<Character[]>
}
