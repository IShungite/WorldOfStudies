import { Id } from '#shared/id/domain/models/id'

export class InventoryAlreadyExistsForCharacterException extends Error {
  constructor(characterId: Id) {
    super(`Inventory already exists for character ${characterId.toString()}`)
  }
}
