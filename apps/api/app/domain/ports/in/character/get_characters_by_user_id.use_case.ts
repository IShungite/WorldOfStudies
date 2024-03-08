import { Character } from '#domainModels/character'
import { Id } from '#domainModels/id/id'

export interface GetCharactersByUserIdUseCase {
  get: (userId: Id) => Promise<Character[]>
}
