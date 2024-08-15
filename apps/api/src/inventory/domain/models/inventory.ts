import { Id } from '#shared/id/domain/models/id'
import { Item } from '#item/domain/models/item'

type InventoryProps = {
  id?: Id
  items: Item[]
}

export class Inventory {
  readonly id: Id
  readonly items: Item[]

  constructor({ id, items }: InventoryProps) {
    this.id = id ?? Id.factory()
    this.items = items
  }
}
