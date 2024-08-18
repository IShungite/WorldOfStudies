import { Id } from '#shared/id/domain/models/id'
import { InventoryItem } from '#inventory/domain/models/inventory_item'

type InventoryProps = {
  id?: Id
  items: InventoryItem[]
}

export class Inventory {
  readonly id: Id
  readonly items: InventoryItem[]

  constructor({ id, items }: InventoryProps) {
    this.id = id ?? Id.factory()
    this.items = items
  }
}
