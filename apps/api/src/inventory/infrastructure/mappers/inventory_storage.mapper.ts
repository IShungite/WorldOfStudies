import { Id } from '#shared/id/domain/models/id'
import { Item } from '#item/domain/models/item'
import InventoryEntity from '#inventory/infrastructure/entities/inventory'
import { Inventory } from '#inventory/domain/models/inventory'
import { InventoryItem } from '#inventory/domain/models/inventory_item'

export class InventoryStorageMapper {
  static fromLucid(inventoryEntity: InventoryEntity): Inventory {
    return new Inventory({
      id: new Id(inventoryEntity.id.toString()),
      items: inventoryEntity.items.map(
        (inventoryItemEntity) =>
          new InventoryItem({
            id: new Id(inventoryItemEntity.id.toString()),
            item: new Item({
              id: new Id(inventoryItemEntity.item.id.toString()),
              name: inventoryItemEntity.item.name,
              icon: inventoryItemEntity.item.icon,
              image: inventoryItemEntity.item.image,
              type: inventoryItemEntity.item.type,
            }),
          })
      ),
    })
  }
}
