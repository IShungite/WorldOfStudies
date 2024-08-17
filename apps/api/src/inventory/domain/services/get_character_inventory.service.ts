import { inject } from '@adonisjs/core'
import { Id } from '#shared/id/domain/models/id'
import { IInventoryRepository } from '#inventory/domain/contracts/repositories/inventory.repository'
import { Inventory } from '#inventory/domain/models/inventory'
import { InventoryNotFoundForCharacterException } from '#inventory/domain/exceptions/inventory_not_found_for_character.exception'

@inject()
export class GetCharacterInventoryService {
  constructor(private readonly inventoryRepository: IInventoryRepository) {}

  async execute(characterId: Id): Promise<Inventory> {
    const inventory = await this.inventoryRepository.getByCharacterId(characterId)

    if (!inventory) {
      throw new InventoryNotFoundForCharacterException(characterId)
    }

    return inventory
  }
}
