import { Inventory } from '../../models/inventory.js'
import { Id } from '#shared/id/domain/models/id'

export abstract class IInventoriesRepository {
  abstract getByCharacterId(characterId: Id): Promise<Inventory | null>
  abstract saveForCharacter(characterId: Id, inventory: Inventory): Promise<Inventory>
  abstract empty(): Promise<void>
}
