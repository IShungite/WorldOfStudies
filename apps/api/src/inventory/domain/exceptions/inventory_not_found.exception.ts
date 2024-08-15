import { Id } from '#shared/id/domain/models/id'

export class InventoryNotFoundException extends Error {
  constructor(characterId: Id) {
    super(`Inventory not found for the character ${characterId.toString()}`)
  }
}
