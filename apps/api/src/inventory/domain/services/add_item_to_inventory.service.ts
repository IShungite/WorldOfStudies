import { inject } from '@adonisjs/core'
import { Id } from '#shared/id/domain/models/id'
import { IInventoriesRepository } from '#inventory/domain/contracts/repositories/inventories.repository'
import { Inventory } from '#inventory/domain/models/inventory'
import { GetCharacterInventoryService } from '#inventory/domain/services/get_character_inventory.service'
import { Item } from '#item/domain/models/item'
import { InventoryItem } from '#inventory/domain/models/inventory_item'
import { User } from '#user/domain/models/user'

@inject()
export class AddItemToInventoryService {
  constructor(
    private readonly getCharacterInventory: GetCharacterInventoryService,
    private readonly inventoryRepository: IInventoriesRepository
  ) {}

  async execute(characterId: Id, item: Item, user: User): Promise<Inventory> {
    const inventory = await this.getCharacterInventory.execute(characterId, user)

    inventory.addItem(new InventoryItem({ item }))

    await this.inventoryRepository.saveForCharacter(characterId, inventory)

    return inventory
  }
}
