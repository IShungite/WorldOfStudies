import { inject } from '@adonisjs/core'
import { Id } from '#shared/id/domain/models/id'
import { IInventoryRepository } from '#inventory/domain/contracts/repositories/inventory.repository'
import { Inventory } from '#inventory/domain/models/inventory'
import { InventoryNotFoundException } from '#inventory/domain/exceptions/inventory_not_found.exception'

@inject()
export class GetCharacterInventoryService {
  constructor(private readonly inventoryRepository: IInventoryRepository) {}

  async execute(characterId: Id): Promise<Inventory> {
    const inventory = await this.inventoryRepository.getByCharacterId(characterId)

    if (!inventory) {
      throw new InventoryNotFoundException(characterId)
    }

    return inventory
  }
}
