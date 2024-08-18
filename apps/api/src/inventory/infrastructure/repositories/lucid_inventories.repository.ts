import testUtils from '@adonisjs/core/services/test_utils'
import { Id } from '#shared/id/domain/models/id'
import { IInventoriesRepository } from '#inventory/domain/contracts/repositories/inventories.repository'
import { Inventory } from '#inventory/domain/models/inventory'
import InventoryEntity from '#inventory/infrastructure/entities/inventory'
import { InventoryStorageMapper } from '#inventory/infrastructure/mappers/inventory_storage.mapper'
import InventoryItemEntity from '#inventory/infrastructure/entities/inventory_item'

export class LucidInventoriesRepository implements IInventoriesRepository {
  async getByCharacterId(characterId: Id): Promise<Inventory | null> {
    const inventory = await InventoryEntity.query()
      .where({
        characterId: characterId.toString(),
      })
      .first()

    if (!inventory) {
      return null
    }

    return new Inventory({ id: new Id(inventory.id.toString()), items: [] })
  }

  async saveForCharacter(characterId: Id, inventory: Inventory): Promise<Inventory> {
    // Supprimer les entités imbriquées existantes
    await this.deleteExistingNestedEntity(inventory)

    // Mettre à jour ou créer l'inventaire principal
    await InventoryEntity.updateOrCreate(
      {
        id: Number.parseInt(inventory.id.toString()),
      },
      {
        characterId: Number.parseInt(characterId.toString()),
      }
    )

    // Mettre à jour ou créer les items de l'inventaire
    await Promise.all(
      inventory.items.map(async (inventoryItem) => {
        await InventoryItemEntity.updateOrCreate(
          {
            id: Number.parseInt(inventoryItem.id.toString()),
          },
          {
            inventoryId: Number.parseInt(inventory.id.toString()),
            itemId: Number.parseInt(inventoryItem.item.id.toString()),
          }
        )
      })
    )

    return inventory
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }

  private async getById(inventoryId: Id): Promise<Inventory | null> {
    const inventory = await InventoryEntity.find(inventoryId.toString())

    return inventory ? InventoryStorageMapper.fromLucid(inventory) : null
  }

  private async deleteExistingNestedEntity(inventory: Inventory) {
    const existingInventoryEntity = await this.getById(inventory.id)

    if (!existingInventoryEntity) return

    // Identifier les items à conserver et à supprimer
    const itemsGrouped = existingInventoryEntity.items.reduce(
      (groupedItems, item) => {
        if (!inventory.items.find((newItem) => newItem.id.equals(item.id))) {
          groupedItems.toRemove.push(item.id)
        }

        return groupedItems
      },
      { toRemove: [] as Id[] }
    )

    if (itemsGrouped.toRemove.length > 0) {
      await InventoryItemEntity.query()
        .whereIn(
          'id',
          itemsGrouped.toRemove.map((id) => id.toString())
        )
        .delete()
    }
  }
}
