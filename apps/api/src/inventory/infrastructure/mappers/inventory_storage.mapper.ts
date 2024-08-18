import { Id } from '#shared/id/domain/models/id'
import { Item } from '#item/domain/models/item'
import InventoryEntity from '#inventory/infrastructure/entities/inventory'
import { Inventory } from '#inventory/domain/models/inventory'

export class InventoryStorageMapper {
  static fromLucid(inventoryEntity: InventoryEntity): Inventory {
    return new Inventory({
      id: new Id(inventoryEntity.id.toString()),
      items: inventoryEntity.items.map(
        (inventoryItemEntity) =>
          new Item({
            id: new Id(inventoryItemEntity.id.toString()),
            name: inventoryItemEntity.item.name,
          })
      ),
    })
  }
}
