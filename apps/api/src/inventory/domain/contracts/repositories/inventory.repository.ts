import { Inventory } from '../../models/inventory.js'
import { Id } from '#shared/id/domain/models/id'

export abstract class IInventoryRepository {
  abstract getByCharacterId(characterId: Id): Promise<Inventory | null>
}
