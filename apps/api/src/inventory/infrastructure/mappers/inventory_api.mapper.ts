import { Inventory } from '#inventory/domain/models/inventory'
import { InventoryResponse } from '@world-of-studies/api-types'

export class InventoryApiMapper {
  static toResponse(inventory: Inventory): InventoryResponse {
    return {
      result: {
        items: inventory.items.map((item) => ({
          id: item.id.toString(),
          name: item.item.name,
          type: item.item.type,
          icon: item.item.icon,
          image: item.item.image,
        })),
      },
    }
  }
}
