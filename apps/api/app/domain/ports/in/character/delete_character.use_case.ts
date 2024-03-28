import { Id } from '#domainModels/id/id'

export interface DeleteCharacterUseCase {
  delete(chracterId: Id): Promise<void>
}
