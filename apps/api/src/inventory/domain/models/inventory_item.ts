import { Id } from '#shared/id/domain/models/id'
import { Item } from '#item/domain/models/item'

export interface InventoryItemProps {
  id?: Id
  item: Item
}

export class InventoryItem {
  readonly id: Id
  readonly item: Item
  constructor({ id, item }: InventoryItemProps) {
    this.id = id || Id.factory()
    this.item = item
  }
}
